from django.http import HttpResponseNotAllowed, HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
import stripe
from django.views.generic import View, TemplateView
from django.urls import reverse
from config import settings
from meetings.models import Meeting
from users.models import User
from participations.models import Participation
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from payment.models import HistoryPayment
# Create your views here.

stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentCancelView(TemplateView):
    template_name = 'cancel.html'

class CreatePaymentView(View):
    def post(self, request, meeting_id, *args, **kwargs):
        meeting = get_object_or_404(Meeting, id=meeting_id)
        user_email = request.user.email
        
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'pln',
                    'product_data': {
                        'name': meeting.title,
                    },
                    'unit_amount': int(meeting.price * 100)
                },
                'quantity': 1,
            }],
            mode='payment',
            billing_address_collection='required',
            success_url=request.build_absolute_uri(reverse('success')) + f'?meeting_id={meeting.id}',
            cancel_url=request.build_absolute_uri(reverse('cancel')),
            customer_email=user_email
        )
        
        metadata = {
            'user_id': request.user.id,
            'meeting_id': meeting.id,
        }
        
        return redirect(checkout_session.url)

    def get(self, request, *args, **kwargs):
        return HttpResponseNotAllowed(['POST']) #dozwolone tylko żądania POST


class PaymentSuccessView(View):
    def get(self, request, *args, **kwargs):
        meeting_id = request.GET.get('meeting_id')
        meeting = get_object_or_404(Meeting, id=meeting_id)
        user = request.user

        if not user.is_authenticated:
            messages.error(request, 'Musisz być zalogowany, aby dokończyć rejestrację.')
            return redirect('meetings')

        if meeting.created_by == user:
            messages.error(request, 'Nie możesz dołączyć do własnego spotkania.')
            return redirect('meeting_detail', pk=meeting.id)

        if meeting.number_of_seats > 0:
            participation, created = Participation.objects.get_or_create(meeting=meeting, participant=user)
            meeting.number_of_seats -= 1
            participation.save()
            meeting.save()
            messages.success(request, 'Płatność zakończona, dołączyłeś do wydarzenia!')
        else:
            messages.error(request, 'Brak miejsc, nie możesz dołączyć.')

        return redirect('meetings:meeting_detail', pk=meeting.id)

@csrf_exempt
def stripe_webhook(request):
    if request.method == 'POST':
        payload = request.body
        sig_header = request.headers.get('Stripe-Signature')
        endpoint_secret = settings.WEBHOOK_SECRET

        event = None

        try:
            
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError as e:
            
            return HttpResponse(status=400)

        
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            user_id = session['metadata']['user_id']
            meeting_id = session['metadata']['meeting_id']
            amount_paid = session['amount_total'] / 100
            currency = session['currency']
            stripe_session_id = session['id']
            
            user = User.objects.get(id=user_id)
            meeting = Meeting.objects.get(id=meeting_id)

            HistoryPayment.objects.create(
                user=user,
                meeting=meeting,
                amount_paid=amount_paid,
                currency=currency,
                meeting_title_snapshot=meeting.title,
                stripe_session_id=stripe_session_id
            )
            
            print(f"Udana płatność! ID sesji: {session['id']}")
            print(f"Mail klienta: {session.get('customer_details', {}).get('email')}")

       
        return HttpResponse(status=200)
    
    
    return HttpResponse(status=405)
    
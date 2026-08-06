from django.http import HttpResponseNotAllowed, HttpResponse
from django.shortcuts import redirect, get_object_or_404
import stripe
from django.views.generic import TemplateView
from django.urls import reverse
from config import settings
from meetings.models import Meeting
from users.models import User
from participations.models import Participation
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from payment.models import HistoryPayment
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentCancelView(TemplateView):
    template_name = 'cancel.html'

class CreatePaymentView(APIView):
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
            success_url=f"http://localhost:5173/payment-success?meeting_id={meeting.id}",
            cancel_url=f"http://localhost:5173/meeting/{meeting.id}",
            customer_email=user_email,
            metadata = {
            'user_id': request.user.id,
            'meeting_id': meeting.id,
        }
        )
        
        return Response({'checkout_url': checkout_session.url}, status=status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        return HttpResponseNotAllowed(['POST']) 


class PaymentSuccessView(APIView):
    def get(self, request, *args, **kwargs):
        meeting_id = request.GET.get('meeting_id')
        meeting = get_object_or_404(Meeting, id=meeting_id)
        messages.success(request, 'Płatność w trakcie przetwarzania')

        return redirect('meetings:meeting_detail', pk=meeting.id)

@csrf_exempt
def stripe_webhook(request):
    if request.method == 'POST':
        payload = request.body
        sig_header = request.headers.get('Stripe-Signature')
        endpoint_secret = settings.STRIPE_WEBHOOK_SECREAT

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
            
            if meeting.number_of_seats > 0:
                participation, created = Participation.objects.get_or_create(
                    meeting=meeting, 
                    participant=user
                )
                
                if created:
                    meeting.number_of_seats -= 1
                    meeting.save()
            
            print(f"Udana płatność! ID sesji: {session['id']}")
            print(f"Mail klienta: {session.get('customer_details', {}).get('email')}")

       
        return HttpResponse(status=200)
    
    
    return HttpResponse(status=405)
    
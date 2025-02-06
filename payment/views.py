from django.http import HttpResponseNotAllowed
from django.shortcuts import render, redirect, get_object_or_404
import stripe
from django.views.generic import View, TemplateView
from django.urls import reverse
from config import settings
from meetings.models import Meeting
from participations.models import Participation
from django.contrib import messages
# Create your views here.

stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentCancelView(TemplateView):
    template_name = 'cancel.html'

class CreatePaymentView(View):
    def post(self, request, meeting_id, *args, **kwargs):
        meeting = get_object_or_404(Meeting, id=meeting_id)

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
            success_url=request.build_absolute_uri(reverse('success')) + f'?meeting_id={meeting.id}',
            cancel_url=request.build_absolute_uri(reverse('cancel'))
        )
        return redirect(checkout_session.url)

    def get(self, request, *args, **kwargs):
        return HttpResponseNotAllowed(['POST'])

class PaymentSuccessView(View):
    def get(self, request, *args, **kwargs):
        meeting_id = request.GET.get('meeting_id')
        meeting = get_object_or_404(Meeting, id=meeting_id)
        user = request.user

        if not user.is_authenticated:
            messages.error(request, 'Musisz być zalogowany, aby dokończyć rejestrację.')
            return redirect('meetings')

        self.add_paid_participant(meeting, user)
        return redirect('meeting_detail', pk=meeting.id)

    def add_paid_participant(self, meeting, user):
        if meeting.number_of_seats > 0:
            Participation.objects.create(meeting=meeting, participant=user, is_waiting=False)
            meeting.number_of_seats -= 1
            meeting.save()
            messages.success(self.request, 'Płatność zakończona, dołączyłeś do wydarzenia!')
        else:
            Participation.objects.create(meeting=meeting, participant=user, is_waiting=True)
            meeting.waiting_people += 1
            meeting.save()
            messages.success(self.request, 'Płatność zakończona, ale jesteś na liście oczekujących.')


from django.urls import path
from payment.views import CreatePaymentView, PaymentCancelView, PaymentSuccessView

app_name = 'payment'

urlpatterns = [
    path('<int:meeting_id>/payment/', CreatePaymentView.as_view(), name='payment'),
    path('success/', PaymentSuccessView.as_view(), name='success'),
    path('cancel/', PaymentCancelView.as_view(), name='cancel')
]

from django.utils import timezone
from django import forms

from meetings.models import Meeting


class MeetingForm(forms.ModelForm):
    class Meta:
       model = Meeting
       fields = ['title', 'description', 'date', 'time', 'number_of_seats', 'price']

    def clean_date(self):
        event_data = self.cleaned_data.get('date')
        if event_data and event_data < timezone.localdate():
            raise forms.ValidationError("Data nie może być z przeszłości")
        return event_data

    def clean_price(self):
        event_price = self.cleaned_data.get('price')
        if event_price is not None and event_price < 0:
            raise forms.ValidationError("Cena nie może być mniejsza od zera")
        return event_price

    def clean_number_of_seats(self):
        event_number_of_seats = self.cleaned_data.get('number_of_seats')
        if event_number_of_seats <= 0:
            raise forms.ValidationError("Liczba miejsc nie może być minusowa lub być 0")
        return event_number_of_seats

from django.utils import timezone

from django import forms

class MeetingForm(forms.Form):
    title = forms.CharField(max_length=100)
    description = forms.CharField(max_length=500, widget=forms.TextInput())
    date = forms.DateField()
    time = forms.TimeField()
    number_of_seats = forms.IntegerField()
    price = forms.DecimalField(max_digits=10, decimal_places=2, required=False)

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

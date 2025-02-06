from django.utils import timezone
from django import forms
from cities_light.models import City, SubRegion
from meetings.models import Meeting
from untils import contains_bad_words

class MeetingForm(forms.ModelForm):
    class Meta:
       model = Meeting
       fields = ['title', 'description', 'date', 'time', 'number_of_seats', 'price', 'meeting_city', 'meeting_region', 'meeting_subregion']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        region_id = self.initial.get('meeting_region') or self.data.get('meeting_region')
        subregion_id = self.initial.get('meeting_subregion') or self.data.get('meeting_subregion')


        if region_id:
            self.fields['meeting_city'].queryset = City.objects.filter(region_id=region_id).order_by('name')
        else:
            self.fields['meeting_city'].queryset = City.objects.none()


        if subregion_id:
            self.fields['meeting_subregion'].queryset = SubRegion.objects.filter(region_id=region_id).order_by('name')
        else:
            self.fields['meeting_subregion'].queryset = SubRegion.objects.none()
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

    def clean_meeting_place(self):
        meeting_place = self.cleaned_data.get(['meeting_city', 'meeting_region', 'meeting_subregion'])
        if not meeting_place:
            raise forms.ValidationError("Wybierz miejsce spotkania")
        return meeting_place

    def clean_title(self):
        meeting_title = self.cleaned_data.get('title')
        if not meeting_title:
            raise forms.ValidationError("Podaj tytuł spotkania")

        if meeting_title.isdigit():
            raise forms.ValidationError("Nazwa nie może być liczbą")

        if contains_bad_words(meeting_title):
            raise forms.ValidationError("Tytuł zawiera nieodpowienie słowa.")

        return meeting_title

    def clean_description(self):
        meeting_description = self.cleaned_data.get('description')
        if not meeting_description:
            raise forms.ValidationError("Podaj opis spotkania")

        if contains_bad_words(meeting_description):
            raise forms.ValidationError("Opis zawiera nieodpowiednie słowa")

        return meeting_description
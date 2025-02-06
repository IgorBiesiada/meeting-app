from cities_light.models import Region, City
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User
from django import forms
from untils import contains_bad_words

class UserRegistrationForm(UserCreationForm):
    first_name = forms.CharField(max_length=100, required=True)
    last_name = forms.CharField(max_length=100, required=True)
    email = forms.EmailField(max_length=150, required=True)
    region = forms.ModelChoiceField(queryset=Region.objects.all(), required=True, empty_label='Wybierz Region')
    city = forms.ModelChoiceField(queryset=City.objects.none(), required=True, empty_label='Najpierw wybierz województwo')

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2', 'region', 'city']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        region_id = self.initial.get('region') or self.data.get('region')

        if region_id:
            self.fields['city'].queryset = City.objects.filter(region_id=region_id).order_by('name')
        else:
            self.fields['city'].queryset = City.objects.none()

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if contains_bad_words(username):
            raise forms.ValidationError("Nazwa użytkownika zawiera nieodpowiednie słowa")
        return super().clean_username()

class CustomUserLoginForm(AuthenticationForm):
   username = forms.CharField(label='Username', widget=forms.TextInput(attrs={'class': 'form-control'}))
   password = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={'class': 'form-control'}))


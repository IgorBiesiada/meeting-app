from django.contrib.auth.forms import PasswordChangeForm
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from users.models import User
from django import forms

class UserUpdateEmailForm(forms.ModelForm):
    email = forms.EmailField(max_length=150, required=True)

    class Meta:
        model = User
        fields = ['email']

class UserUpdateUsernameForm(forms.ModelForm):
    username = forms.CharField(max_length=150, required=True)

    class Meta:
        model = User
        fields = ['username']

    def clean_username(self):
        event_username = self.cleaned_data.get('username')
        if event_username.isdigit():
            raise forms.ValidationError('Nazwa nie może być z samych liczb')

        if self.instance and self.instance.username == event_username:
            raise forms.ValidationError('Nowa nazwa użytkownika musi być inna niż aktualna')

        return event_username

class ChangePasswordForm(PasswordChangeForm):
    old_password = forms.CharField(widget=forms.PasswordInput, label="Stare hasło")
    new_password1 = forms.CharField(widget=forms.PasswordInput, label='Nowe hasło')
    new_password2 = forms.CharField(widget=forms.PasswordInput, label='Powtórz nowe hasło')

    class Meta:
        model = User

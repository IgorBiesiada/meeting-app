from django.contrib.auth.forms import PasswordChangeForm

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

class ChangePasswordForm(PasswordChangeForm):
    old_password = forms.CharField(widget=forms.PasswordInput, label="Stare hasło")
    new_password = forms.CharField(widget=forms.PasswordInput, label='Nowe hasło')
    new_password2 = forms.CharField(widget=forms.PasswordInput, label='Powtórz nowe hasło')

    class Meta:
        model = User

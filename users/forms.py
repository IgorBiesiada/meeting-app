from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User
from django import forms


class UserRegistrationForm(UserCreationForm):
    first_name = forms.CharField(max_length=100, required=True)
    last_name = forms.CharField(max_length=100, required=True)
    email = forms.EmailField(max_length=150, required=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']


class CustomUserLoginForm(AuthenticationForm):
   username = forms.CharField(label='Username', widget=forms.TextInput(attrs={'class': 'form-control'}))
   password = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={'class': 'form-control'}))


class UserUpdateEmailForm(forms.ModelForm):
    email = forms.EmailField(max_length=150, required=True)

    class Meta:
        model = User
        fields = ['email']

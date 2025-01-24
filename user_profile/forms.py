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
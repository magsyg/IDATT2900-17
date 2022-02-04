from django import forms
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.contrib.auth import forms as auth_forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, PasswordChangeForm
from django.contrib.auth.models import Group

User = get_user_model()


class SignUpForm(UserCreationForm):
    required_css_class = 'required font-bold'

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
        ]


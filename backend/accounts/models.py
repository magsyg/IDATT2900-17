# imports
from django.db import models
from django.db.models.query import QuerySet

from django.contrib.auth import models as auth_models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import PermissionsMixin

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager

# End: imports -----------------------------------------------------------------


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, username, password=None, **kwargs):
        if not username:
            raise ValueError('Users must have an username')
        user = self.model(username=username, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password, **kwargs):
        user = self.create_user(username=username, password=password, **kwargs)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):

    # Basic Information
    username = models.CharField(max_length=30, unique=True, verbose_name='brukernavn')
    email = models.EmailField(max_length=64, unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=30, null=False, blank=False, verbose_name='Fornavn')
    last_name = models.CharField(max_length=30, null=False, blank=False, verbose_name='Etternavn')

    # User Status
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = UserManager()
    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
        ordering = ['username']


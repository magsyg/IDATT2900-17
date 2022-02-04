# imports
from django.views import View
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, get_user_model, logout

User = get_user_model()
# End: imports -----------------------------------------------------------------


class LoginView(View):
    def post(self, request, *args, **kwargs):
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(request, username=email, password=password)
        error = None
        if user is not None:
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            if self.redirect_url == 'accounts:profile':
                return redirect(self.redirect_url, user_id=user.id)
            return redirect(self.redirect_url)
        error = 'Feil'

        return render(request, self.template, {'error': error})


class CurrentUserView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return request.user.first_name
        else: 
            return "Not logged in"
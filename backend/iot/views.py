from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.
loginPage = '/login'

@login_required(login_url=loginPage)
def index(request):
    return render(request, 'iot/index.html')
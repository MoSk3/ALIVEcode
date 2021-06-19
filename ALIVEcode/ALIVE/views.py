from django.core.exceptions import PermissionDenied
from django.shortcuts import render
from django.test import SimpleTestCase, override_settings
from django.urls import path


def bad_request(request, exception=None):
    return render(request, '400.html')

def permission_denied(request, exception=None):
    return render(request, '403.html')

def page_not_found(request, exception=None):
    return render(request, '404.html')

def server_error(request, exception=None):
    return render(request, '500.html')
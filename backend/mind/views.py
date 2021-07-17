from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from mind.models import AMC, DataSheet, AMCSerializer
from rest_framework.renderers import JSONRenderer
from mind.forms import DataSheetCreationForm
from datetime import datetime
import json

# Create your views here.

loginPage = '/login'

def index(request):
    context = {}
    return render(request, 'mind/index.html', context)

def fonctionnement(request):
    context = {}
    return render(request, 'mind/fonctionnement.html', context)


def race(request):
    context = {}
    return render(request, 'mind/race.html', context)

@login_required(login_url=loginPage)
def analyze(request):
    form = DataSheetCreationForm()
    context = {}

    id = request.session.get('amc', None)
    if id is None and request.method == 'GET':
        if 'id' in request.GET:
            id = request.GET['id']

    if id is not None:
        try:
            amc = AMC.objects.get(identifier=id)
            context['amc'] = amc
            request.session['amc'] = id
            serializer = AMCSerializer(amc)
            context['serializedData'] = serializer.data

            if request.method == 'POST':
                form = DataSheetCreationForm(request.POST)
                if form.is_valid():
                    datasheet = form.save(commit=True)
                    amc.dataSheets.add(datasheet)
                    return redirect('mind:analyze')

        except AMC.DoesNotExist:
            messages.error(request, "Ce numéro d'identification n'appartient à aucun contrôleur AMC enregistré")

    context['form'] = form
    return render(request, 'mind/analyze.html', context)

@login_required(login_url=loginPage)
def analyze_disconnect(request):
    if 'amc' in request.session:
        del request.session['amc']
    return redirect('mind:analyze')

@login_required(login_url=loginPage)
def delete_datasheet(request):
    context = {}
    id = request.session.get('amc', None)
    if id is not None:
        try:
            amc = AMC.objects.get(identifier=id)
            """
            context['amc'] = amc
            request.session['amc'] = id
            serializer = AMCSerializer(amc)
            context['serializedData'] = serializer.data
            """

            if request.method == 'POST':
                if 'id' in request.POST:
                    datasheetId = request.POST['id']
                    try:
                        dataSheet = amc.dataSheets.get(id=datasheetId)
                        dataSheet.points.all().delete()
                        dataSheet.delete()
                        return redirect('mind:analyze')
                    except DataSheet.DoesNotExist:
                        messages.error(request, "Erreur lors de la suppression de la datasheet")


        except AMC.DoesNotExist:
            messages.error(request, "Ce numéro d'identification n'appartient à aucun contrôleur AMC enregistré")
    return render(request, 'mind/analyze.html', context)

@login_required(login_url=loginPage)
def clear_datasheet(request):
    context = {}
    id = request.session.get('amc', None)
    if id is not None:
        try:
            amc = AMC.objects.get(identifier=id)
            """
            context['amc'] = amc
            request.session['amc'] = id
            serializer = AMCSerializer(amc)
            context['serializedData'] = serializer.data
            """

            if request.method == 'POST':
                if 'id' in request.POST:
                    datasheetId = request.POST['id']
                    try:
                        dataSheet = amc.dataSheets.get(id=datasheetId)
                        dataSheet.points.all().delete()
                        dataSheet.date = datetime.now()
                        dataSheet.save()
                        return redirect('mind:analyze')
                    except DataSheet.DoesNotExist:
                        messages.error(request, "Erreur lors de la suppression de la datasheet")


        except AMC.DoesNotExist:
            messages.error(request, "Ce numéro d'identification n'appartient à aucun contrôleur AMC enregistré")
    return render(request, 'mind/analyze.html', context)

@login_required(login_url=loginPage)
def record_datasheet(request):
    context = {}
    id = request.session.get('amc', None)
    if id is not None:
        try:
            amc = AMC.objects.get(identifier=id)
            """
            context['amc'] = amc
            request.session['amc'] = id
            serializer = AMCSerializer(amc)
            context['serializedData'] = serializer.data
            """

            if request.method == 'POST':
                response = {}
                if 'id' in request.POST:
                    datasheetId = request.POST['id']
                    try:
                        dataSheet = amc.dataSheets.get(id=datasheetId)
                        response['status'] = 'success'
                        if amc.currentDataSheet == dataSheet:
                            amc.currentDataSheet = None
                            amc.save()
                            response['action'] = 'stop'
                        else:
                            if dataSheet.date is None:
                                dataSheet.date = datetime.now()
                                dataSheet.save()
                            amc.currentDataSheet = dataSheet
                            amc.save()
                            response['action'] = 'start'
                    except DataSheet.DoesNotExist:
                        response['status'] = 'fail'
                        response['code'  ] = '404'
                return JsonResponse(response)

        except AMC.DoesNotExist:
            messages.error(request, "Ce numéro d'identification n'appartient à aucun contrôleur AMC enregistré")
    return render(request, 'mind/analyze.html', context)

"""
@login_required(login_url=loginPage)
def stop_record_datasheet(request):
    context = {}
    id = request.session.get('amc', None)
    if id is not None:
        try:
            amc = AMC.objects.get(identifier=id)
"""
"""
            context['amc'] = amc
            request.session['amc'] = id
            serializer = AMCSerializer(amc)
            context['serializedData'] = serializer.data
"""
"""
            if request.method == 'POST':
                if 'id' in request.POST:
                    datasheetId = request.POST['id']
                    try:
                        dataSheet = amc.dataSheets.get(id=datasheetId)
                        if dataSheet == amc.currentDataSheet:
                            amc.currentDataSheet = None
                            amc.save()
                            return redirect('mind:analyze')
                    except DataSheet.DoesNotExist:
                        messages.error(request, "Erreur lors de la suppression de la datasheet")


        except AMC.DoesNotExist:
            messages.error(request, "Ce numéro d'identification n'appartient à aucun contrôleur AMC enregistré")
    return render(request, 'mind/analyze.html', context)
"""
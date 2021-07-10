from mind.models import DataSheet
from django import forms

class DataSheetCreationForm(forms.ModelForm):
    class Meta:
        model = DataSheet
        fields = ['name', 'description']

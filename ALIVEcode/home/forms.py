from django import forms

from django.contrib.auth import get_user_model
User = get_user_model()

class StudentCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    name = forms.CharField(label='first_name', widget=forms.TextInput)

    class Meta:
        model = User
        fields = ['email', 'password1']

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        user.registerStudent(self.cleaned_data['name'])
        return user

class ProfessorCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    first_name = forms.CharField(label='first_name', widget=forms.TextInput)
    last_name = forms.CharField(label='last_name', widget=forms.TextInput)

    class Meta:
        model = User
        fields = ['email', 'password1']

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        user.registerProfessor(self.cleaned_data['first_name'], self.cleaned_data['last_name'])
        return user

from django.db import models
from rest_framework import serializers

from django.conf import settings
User = settings.AUTH_USER_MODEL

# Create your models here.

class JsTimestampField(serializers.Field):
    def to_representation(self, value):
        return round(value.timestamp()*1000)

class AMC(models.Model):
    identifier = models.CharField(max_length=10)

    dataSheets = models.ManyToManyField("mind.DataSheet", blank=True, related_name="all_data_sheets")

    currentDataSheet = models.ForeignKey("mind.DataSheet", blank=True, null=True, on_delete=models.SET_NULL)

    linkedUser = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL)

class DataSheet(models.Model):
    name = models.CharField(blank=False, max_length=100)

    description = models.CharField(blank=True, max_length=500)

    points = models.ManyToManyField("mind.DataPoint", blank=True)

    date = models.DateTimeField(null=True)

class DataPoint(models.Model):
    comment = models.CharField(blank=True, max_length=250)

    signal_strength = models.SmallIntegerField()
    attention = models.SmallIntegerField()
    meditation = models.SmallIntegerField()
    delta = models.SmallIntegerField()
    theta = models.SmallIntegerField()
    alpha_low = models.SmallIntegerField()
    alpha_high = models.SmallIntegerField()
    beta_low = models.SmallIntegerField()
    beta_high = models.SmallIntegerField()
    gamma_low = models.SmallIntegerField()
    gamma_high = models.SmallIntegerField()

    date = models.DateTimeField(auto_now_add=True)

class DataPointSerializer(serializers.ModelSerializer):
    date = JsTimestampField()

    class Meta:
        model = DataPoint
        fields = '__all__'
        depth = 1

class DataSheetSerializer(serializers.ModelSerializer):
    date = JsTimestampField()
    points = DataPointSerializer(many=True)

    class Meta:
        model = DataSheet
        fields = ['name', 'description', 'points', 'date', 'id']
        depth = 2

class AMCSerializer(serializers.ModelSerializer):
    
    dataSheets = DataSheetSerializer(many=True)

    class Meta:
        model = AMC
        fields = ['identifier', 'dataSheets', 'currentDataSheet']
        depth = 3

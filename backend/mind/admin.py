from django.contrib import admin
from mind.models import DataSheet, DataPoint, AMC

@admin.register(DataSheet)
class DataSheetAdmin(admin.ModelAdmin):
    pass

@admin.register(DataPoint)
class DataPointAdmin(admin.ModelAdmin):
    pass

@admin.register(AMC)
class AMCAdmin(admin.ModelAdmin):
    pass
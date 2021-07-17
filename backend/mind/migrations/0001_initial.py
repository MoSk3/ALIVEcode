# Generated by Django 3.2 on 2021-04-29 21:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='DataPoint',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.CharField(blank=True, max_length=250)),
                ('signal_strength', models.SmallIntegerField()),
                ('attention', models.SmallIntegerField()),
                ('meditation', models.SmallIntegerField()),
                ('delta', models.SmallIntegerField()),
                ('theta', models.SmallIntegerField()),
                ('alpha_low', models.SmallIntegerField()),
                ('alpha_high', models.SmallIntegerField()),
                ('beta_low', models.SmallIntegerField()),
                ('beta_high', models.SmallIntegerField()),
                ('gamma_low', models.SmallIntegerField()),
                ('gamma_high', models.SmallIntegerField()),
                ('date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='DataSheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.CharField(blank=True, max_length=500)),
                ('date', models.DateTimeField(null=True)),
                ('points', models.ManyToManyField(blank=True, to='mind.DataPoint')),
            ],
        ),
        migrations.CreateModel(
            name='AMC',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identifier', models.CharField(max_length=10)),
                ('currentDataSheet', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='mind.datasheet')),
                ('dataSheets', models.ManyToManyField(blank=True, related_name='all_data_sheets', to='mind.DataSheet')),
                ('linkedUser', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
import uuid
from django.core import validators
from django.db import models
from django.db.models.deletion import CASCADE
import playground.models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from django.contrib.auth import get_user_model
User = get_user_model()

class IoTSystem(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False,
                          unique=True, primary_key=True)

    name = models.CharField(max_length=20)

    creator = models.ForeignKey(User, null=False, on_delete=models.CASCADE, related_name='IoTSystems')

    class IoTSystemLabels(models.TextChoices):
        HOME = 'HO', _('Home')
        OTHER = 'OT', _('Other')

    label = models.CharField(max_length=2, choices=IoTSystemLabels.choices, default=IoTSystemLabels.HOME)

    def __str__(self):
        return f"{self.name}, {self.get_label_display()}"
        

class IoTProject(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False,
                          unique=True, primary_key=True)

    name = models.CharField(max_length=20)
    description = models.CharField(max_length=100)

    creator = models.ForeignKey(User, null=False, on_delete=models.CASCADE, related_name="IoTProjects")

    # JSON representation of all the components
    body = models.CharField(max_length=100000, default="{}")
    
    access = models.CharField(max_length=2, choices=playground.models.ACCESS.choices, default=playground.models.ACCESS.PRIVATE)

    class INTERACT_RIGHTS(models.TextChoices):
        ANYONE        = "AN", _("Anyone")         # anyone can interact
        COLLABORATORS = "CO", _("Collaborators")  # creator and collaborators can interact
        PRIVATE       = "PR", _("Private")        # only the creator can interact

    interact_rights = models.CharField(max_length=2, choices=INTERACT_RIGHTS.choices, default=INTERACT_RIGHTS.PRIVATE)

    collaborators = models.ManyToManyField(User, max_length=100, related_name="IoTProjects_collab")


def route_validator(route: str):
    # Check if the route is only composed of numbers, letters, _ and - 
    validators.validate_slug(route)
    if route.lower() == 'update':
        raise ValidationError(
            _("%(route)s est une route réservée"),
            params={'route': route},
        )
    

class Route(models.Model):
    name = models.CharField(max_length=20, blank=False, null=False)
    route = models.CharField(validators=[route_validator], max_length=15, blank=False, null=False)

    project = models.ForeignKey(IoTProject, null=False, on_delete=models.CASCADE)

    class Protocols(models.TextChoices):
        WEBSOCKET = 'WS', _('Websocket')
        HTTP_POST = 'HP', _('HTTP POST')
        HTTP_GET = 'HG', _('HTTP GET')

    protocol = models.CharField(max_length=2, choices=Protocols.choices, default=Protocols.HTTP_POST)

    linkedScript = models.ForeignKey(playground.models.AliveScript, null=True, on_delete=models.DO_NOTHING, related_name="linked_routes")


class IoTCluster(models.Model):
    name = models.CharField(max_length=25, blank=False, null=False)
    creator = models.ForeignKey(User, null=False, on_delete=CASCADE)
    projects = models.ManyToManyField(IoTProject, related_name='clusters')

    systems = models.ManyToManyField(IoTSystem, max_length=5, related_name='clusters')
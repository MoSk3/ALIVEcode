from django.db import models
import uuid

from django.conf import settings
User = settings.AUTH_USER_MODEL

# Modèle/SQLtable d'un challenge (vive django)

class Challenge(models.Model):
    ACCESS = [
        ("PU", "Public"),    # can be found via a search
        ("UN", "Unlisted"),  # must be shared via a url
        ("RE", "Restrein"),  # limited to a Coursee
        ("PR", "Private"),   # only accessible to the creator
    ]
    id = models.UUIDField(default=uuid.uuid4, editable=False,
                          unique=True, primary_key=True)
    """
    JE SAIS, PAS DE NULL, mais j'ai paniqué, on l'arrangera au prochain reset de la db
    """
    creator = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=30,default='(Sans nom)')
    desc = models.CharField(max_length=100,blank=True)
    hint = models.CharField(max_length=50,blank=True)
    solution = models.CharField(max_length=150,blank=True)
    
    access = models.CharField(max_length=2, choices=ACCESS, default="PR")

    def isType(self, typeToCheck):
        foreignKeyType = getattr(self, "specific_challenge").__class__
        return foreignKeyType == typeToCheck

    def __str__(self):
        return f"{self.name} by {self.creator}"

class ALIVEChallenge(models.Model):
    challenge = models.OneToOneField(Challenge, on_delete=models.CASCADE, related_name="specific_challenge")
    level = models.TextField(default='{"initial-code":[]}')

    def __str__(self):
        return f"{self.challenge}"


class ChallengeProgression(models.Model):
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    state = models.CharField(max_length=20, choices=[
        ("ongoing", "🟡"),
        ("completed", "🟢")
    ])
    date = models.DateTimeField(auto_created=True)
    
    def update(self):
        self.save(force_update=True)

    def get_code(self):
        return self.code

    def __str__(self):
        return f"{self.challenge} of {self.user}"

class ALIVEChallengeProgression(models.Model):
    challenge_progression = models.OneToOneField(ChallengeProgression, on_delete=models.CASCADE, related_name="alive_challenge_progression")
    code = models.TextField(blank=True)
    solutions = models.TextField(default="[]")
    
    def update_code(self, code):
        self.code = code
        self.save(force_update=True)
        self.challenge_progression.update()
    
    def __str__(self):
        return f"{self.challenge_progression}"


class Level(models.Model):

    TAG = [

    ]

    ACCESS = [
        ("PU", "Public"),    # can be found via a search
        ("UN", "Unlisted"),  # must be shared via a url
        ("RE", "Restrein"),  # limited to a Coursee
        ("PR", "Private"),   # only accessible to the creator
    ]

    RESOLUTION_MODES = [
        ("B", "Block"),  # must be cleared with the block interface
        ("C", "Code"),   # must be cleared with the code interface
        ("A", "Any")     # can be cleared with either the code or the block interface
    ]

    creator = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    creation_date = models.DateField()
    access = models.CharField(max_length=2, choices=ACCESS)

    description = models.TextField(blank=True)

    resolution_mode = models.CharField(max_length=1, choices=RESOLUTION_MODES)

    starting_code = models.TextField(default="")
    starting_code_frozen = models.BooleanField(default=False)

    difficulty = models.CharField(max_length=1, choices=[
        ("1", "débutant"),
        ("2", "facile"),
        ("3", "intermédiaire"),
        ("4", "avancé"),
        ("5", "difficile"),
        ("6", "expert")
    ])

    tags = models.CharField(max_length=20)

    hints = None  # list of TextFields

    creator_solution = models.TextField(blank=True)

    player_solutions = None  # { Profil: TextField }

    layout = models.TextField(default="{}")  # layout of the level in a JSON format


class Course(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False,
                          unique=True, primary_key=True)

    creator = models.ForeignKey("home.professor", on_delete=models.CASCADE)

    code = models.CharField(max_length=10, unique=True)

    name = models.CharField(default="Nouveau Cours", max_length=100)

    description = models.TextField(null=True, blank=True, max_length=500)

    subject = models.CharField(max_length=2, choices=[
        ("in", "Informatique"),
        ("ai", "Intelligence Artificielle"),
        ("ma", "Mathématiques"),
        ("sc", "Sciences")
    ], null=False, blank=False)

    difficulty = models.CharField(max_length=1, choices=[
        ("1", "débutant"),
        ("2", "facile"),
        ("3", "intermédiaire"),
        ("4", "avancé"),
        ("5", "difficile"),
        ("6", "expert")
    ])
    
    access = models.CharField(max_length=2, choices=[
        ("PU", "Public"),           # can be found via a search
        ("UN", "Non répertorié"),   # must be shared via a url
        ("RE", "Restrain"),         # limited to certain classes
        ("PR", "Privé"),            # only accessible to the creator
    ], default="PR")

    def __str__(self):
        return f"{self.name}, creator: {self.creator}"


class Section(models.Model):
    name = models.CharField(blank=False, max_length=50)

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    
    state = models.CharField(max_length=20, choices=[
        ("locked", "🔒"),
        ("unlocked", "🔓"),
        ("ongoing", "🟡"),
        ("completed", "🟢"),
        ("perfect", "⭐")
    ], default="locked")

    def __str__(self):
        return f"{self.name}, course: {self.course}"
    


class Activity(models.Model):
    name = models.CharField(blank=False, max_length=100)

    description = models.CharField(blank=True, max_length=500)

    section = models.ForeignKey(Section, on_delete=models.CASCADE)

    required = models.BooleanField(blank=False, null=False, default=True)

    content = models.TextField(default="", blank=True)

    challenges = models.ManyToManyField(Challenge, blank=True)
    
    starting_state = models.CharField(max_length=20, choices=[
        ("locked", "🔒"),
        ("unlocked", "🔓"),
        ("ongoing", "🟡"),
        ("completed", "🟢"),
        ("perfect", "⭐")
    ], default="locked")

    def __str__(self):
        return f"{self.name}, section: {self.section}"


class ActivityProgression(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    challenge_progressions = models.ManyToManyField(ChallengeProgression, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    state = models.CharField(max_length=20, choices=[
        ("locked", "🔒"),
        ("unlocked", "🔓"),
        ("ongoing", "🟡"),
        ("completed", "🟢"),
        ("perfect", "⭐")
    ])
    
    completion = models.FloatField(default=0.0)
    
    date = models.DateTimeField(auto_created=True)
    
    def update_completion(self):
        self.completion = self.get_nb_challenges_completed() / self.get_nb_challenges() if self.get_nb_challenges() > 0 else 0.0
        self.save(force_update=True)
            
    def completion_as_pourcentage(self):
        return self.completion * 100
    
    def get_nb_challenges(self):
        return len(self.challenge_progressions.all())
    
    def get_nb_challenges_completed(self):
        return len([challenge for challenge in self.challenge_progressions.all() 
                        if challenge.state == "completed"])
                    
    def __str__(self):
        return f"{self.user}, {self.date}"


    

class Classroom(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False,
                          unique=True, primary_key=True)

    creator = models.ForeignKey(
        "home.professor", on_delete=models.CASCADE, related_name='professor')

    students = models.ManyToManyField("home.student", blank=True)

    courses = models.ManyToManyField("playground.course", blank=True)

    code = models.CharField(max_length=6, unique=True)
    
    name = models.CharField(default="Nouvelle classe", max_length=100)

    description = models.TextField(null=True, blank=True, max_length=500)

    subject = models.CharField(max_length=2, choices=[
        ("in", "Informatique"),
        ("ai", "Intelligence Artificielle"),
        ("ma", "Mathématiques"),
        ("sc", "Sciences")
    ], null=False, blank=False)

    def __str__(self):
        return f"{self.name}, {self.subject} by {self.creator}"


"""
@receiver(post_save, sender=Classroom)
def save_classroom_handler(**kwargs):
    classroom = kwargs['instance']


class Reponse(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    texte = models.CharField(max_length=200)
    vf = models.BooleanField(default=False)
    question = models.ForeignKey(Question, on_delete=models.DO_NOTHING)
    for student in classroom.students.all():
        print(student.email)
        student.classrooms.add(classroom)
"""

class Quiz(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    creator = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=50)
    questions = models.ManyToManyField("playground.question")

    def __str__(self):
        return f"{self.name} by {self.creator}"

class Question(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    numero=models.IntegerField(null=False)
    question = models.CharField(max_length=200)
    timer=models.CharField(max_length=2, choices=[
        ("15", "15 secondes"),
        ("30", "30 secondes"),
        ("45", "45 secondes")
    ], null=False, blank=False, default="30")
    answers = models.ManyToManyField("playground.response")

class Response(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    text = models.CharField(max_length=200)
    correct = models.BooleanField(default=False)

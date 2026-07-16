from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class room(models.Model):
    vchr_name=models.CharField(max_length=100)
    int_size=models.BigIntegerField()
    vchr_purpose=models.CharField(max_length=100)
    image = models.FileField()
    int_rent = models.BigIntegerField()

class app_user(models.Model):
    vchr_name=models.CharField(max_length=100)
    int_phone = models.CharField(max_length=100)
    vchr_place = models.CharField(max_length=100)
    fk_LOGIN = models.ForeignKey(User,on_delete=models.CASCADE)

class schedule(models.Model):
    fk_ROOM = models.ForeignKey(room,on_delete=models.CASCADE)
    from_time = models.CharField(max_length=100)
    to_time = models.CharField(max_length=100)
    date=models.DateField()
    status = models.CharField(max_length=100,default='Pending')


class booking(models.Model):
    fk_USER = models.ForeignKey(app_user,on_delete=models.CASCADE)
    fk_SCHEDULE = models.ForeignKey(schedule,on_delete=models.CASCADE)
    vchr_purpose = models.CharField(max_length=100)

    


from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.contrib.auth import authenticate
from django.http import JsonResponse

from myapp.serializer import roomSerializer, UserSerializer, ScheduleSerializer,BookingSerializer


from .models import app_user,room,schedule,booking




# Create your views here.

@csrf_exempt
def login(request):
    if request.method=="POST":
        data = JSONParser().parse(request)

        username= data.get("username")
        password = data.get("password")

        auth_user = authenticate(username=username,password=password)

        if auth_user is None:
            return JsonResponse({
                "status" : "failed",
                "message": "Invalid Username or Password"
            })
        if auth_user.groups.filter(name="admin").exists():
            return JsonResponse({
                "status" : "success",
                "message" : "Login Successfull",
                "role" : 'admin'
            })
        
        elif auth_user.groups.filter(name="user").exists():
            profile = app_user.objects.get(fk_LOGIN = auth_user)

            return JsonResponse({
                'status' : 'success',
                "message" : 'Login Successfull',
                "role": 'user',
                'user_id' : profile.id
            })
        
        else:
            return JsonResponse({
                'status' : 'failed',
                'message' : "No group assigned"
            })
        


from django.contrib.auth.models import User,Group

@csrf_exempt
def user_reg(request):

    if request.method == 'POST':

        data=JSONParser().parse(request)

        if User.objects.filter(username = data['username']).exists():
            return JsonResponse({
                "status" : "failed",
                "message" : "Username alerady exists"
            })
        
        login = User.objects.create_user(
            username = data['username'],
            password=data['password']
        )

        login.groups.add(Group.objects.get(name='user'))

        app_user.objects.create(
            vchr_name = data['vchr_name'],
            int_phone = data['int_phone'],
            vchr_place = data['vchr_place'],
            fk_LOGIN = login
        )

        return JsonResponse({
            "status" : "success",
            "message" : "Registration Successful"
        })
    

@csrf_exempt
def meating_room(request, id=0):

    if request.method == 'GET':

        rooms = room.objects.all()
        serializer = roomSerializer(rooms, many=True)

        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        room_obj = room.objects.create(
            vchr_name = request.POST.get('vchr_name'),
            int_size = request.POST.get('int_size'),
            vchr_purpose = request.POST.get('vchr_purpose'),
            int_rent = request.POST.get('int_rent'),
            image = request.FILES.get('image')
        )

        return JsonResponse("Added Successfuly", safe=False)
    
    
@csrf_exempt
def edit_meeting_room(request,id):   
    if  request.method == 'PUT':

        room_data = JSONParser().parse(request)

        room_obj = room.objects.get(id=id)

        serializer = roomSerializer(room_obj, data=room_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse("Updated Successfully", safe=False)
        
        return JsonResponse(serializer.errors, safe=False)
    
    


@csrf_exempt
def add_schedule(request):
    if request.method == "POST":

        room_id = request.POST.get("room_id")

        a = room.objects.get(id=room_id)

        schedule.objects.create( 
            fk_ROOM=a,
            from_time=request.POST.get("from_time"),
            to_time=request.POST.get("to_time"),
            date=request.POST.get("date")
        )

        return JsonResponse({
            "status": "success"
        })
    

@csrf_exempt 
def view_schedule(request):
    if request.method == 'GET':
        a=schedule.objects.all()
        serializer = ScheduleSerializer(a,many=True)
        
        return JsonResponse(serializer.data,safe=False)
    


    

@csrf_exempt
def book_room(request):
    if request.method == "POST":

        user_id = request.POST.get("user_id")
        schedule_id = request.POST.get("schedule_id")
        purpose = request.POST.get("vchr_purpose")

        user_obj = app_user.objects.get(id=user_id)
        schedule_obj = schedule.objects.get(id=schedule_id)

        booking.objects.create(
            fk_USER=user_obj,
            fk_SCHEDULE=schedule_obj,
            vchr_purpose=purpose,
        )

        schedule_obj.status = 'Booked'
        schedule_obj.save()

        return JsonResponse({
            "status": "success",
            "message": "Room booked successfully"
        })
    

@csrf_exempt
def view_booking(request):
    if request.method == 'GET':
        a=booking.objects.all()
        serializer = BookingSerializer(a,many=True)

        return JsonResponse(serializer.data,safe=False)
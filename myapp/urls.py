from django.urls import path
from . import views

urlpatterns = [
    path('login/',views.login),
    path('user_reg/',views.user_reg),
    path('meating_room/',views.meating_room),
    path('add_schedule/',views.add_schedule),
    path('view_schedule/',views.view_schedule),
    path('book_room/',views.book_room),
    path('view_booking/',views.view_booking),
    path('edit_meeting_room/<id>/',views.edit_meeting_room),
    
]
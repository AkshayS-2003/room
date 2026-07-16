from rest_framework import serializers
from .models import room, app_user, schedule, booking


class roomSerializer(serializers.ModelSerializer):
    class Meta:
        model = room
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = app_user
        fields = "__all__"


class ScheduleSerializer(serializers.ModelSerializer):
    room_name = serializers.CharField(
        source='fk_ROOM.vchr_name',
        read_only=True
    )

    class Meta:
        model = schedule
        fields = "__all__"
        depth = 1


class BookingSerializer(serializers.ModelSerializer):
    schedule_name = serializers.CharField(
        source='fk_SCHEDULE.date',
        read_only=True
    )
    user_name = serializers.CharField(
        source='fk_USER.vchr_name',
        read_only=True
    )

    class Meta:
        model = booking
        fields = "__all__"
        depth = 2
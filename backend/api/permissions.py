from rest_framework.response import Response
from rest_framework import status
from functools import wraps
from api.models import UserProfile


def admin_only(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        user = request.user

        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "User profile not found"},
                status=status.HTTP_403_FORBIDDEN
            )

        if profile.role != 'admin':
            return Response(
                {"error": "Only admin can access this"},
                status=status.HTTP_403_FORBIDDEN
            )

        return view_func(request, *args, **kwargs)

    return wrapper
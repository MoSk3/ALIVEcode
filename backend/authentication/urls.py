from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from .views import HelloWorldView, CustomUserCreate, UserViewSet

urlpatterns = [
    path('user/create/', CustomUserCreate.as_view(), name="create_user"),
    path('user/info/', UserViewSet.as_view({'get': 'getInfo'}), name="user_info"),
    path('token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),  # override sjwt stock token
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('hello', HelloWorldView.as_view(), name='hello')
]
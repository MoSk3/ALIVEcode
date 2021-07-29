from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CustomUserSerializer
from authentication import serializers

class CustomUserCreate(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        print(request.data)
        serializer = CustomUserSerializer(data=request.data)
        try:
            print(serializer.is_valid(raise_exception=True))
        except Exception as e:
            print(e)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):

    def getInfo(self, request):
        queryset = request.user
        serializer = CustomUserSerializer(queryset)
        return Response(serializer.data)

class HelloWorldView(APIView):

    def get(self, request):
        return Response(data={"hello":"world"}, status=status.HTTP_200_OK)
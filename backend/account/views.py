from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import RegisterSerializer, UserInfoSerializer
from .models import User

class RegisterViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    
    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'name': user.name
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    user = User.objects.get(email=request.user)
    serializer = UserInfoSerializer(user)
    return Response(serializer.data)
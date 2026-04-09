from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class ProfileMeMixin:
    """
    Mixin to provide a 'me' action that returns the profile of the current logged-in user.
    The model must have a 'user' field.
    """
    @action(detail=False, methods=['get'])
    def me(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
            
        try:
            # We assume the model class is available via self.get_queryset().model
            model_class = self.get_queryset().model
            instance = model_class.objects.get(user=request.user)
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Exception:
            # Fallback if the user has no profile of this type
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

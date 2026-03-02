from rest_framework import viewsets
from .models import Projects
from .serializers import ProjectsSerializer

class ProjectsViewSet(viewsets.ModelViewSet):
    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return Projects.objects.filter(user_id=user_id)
        return Projects.objects.all()

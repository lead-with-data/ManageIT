from rest_framework import viewsets
from .models import Sprints, SprintTasks
from .serializer import SprintsSerializer, SprintTasksSerializer

class SprintsViewSet(viewsets.ModelViewSet):
    queryset = Sprints.objects.all()
    serializer_class = SprintsSerializer

class SprintTasksViewSet(viewsets.ModelViewSet):
    queryset = SprintTasks.objects.all()
    serializer_class = SprintTasksSerializer
    def get_queryset(self):
        assignee_id = self.request.query_params.get('assignee_id')
        if assignee_id:
            return SprintTasks.objects.filter(assignee=assignee_id)
        return SprintTasks.objects.all()

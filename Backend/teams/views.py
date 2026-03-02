from rest_framework import viewsets
from .models import Teams, TeamMembers
from .serializer import TeamsSerializer, TeamMembersSerializer

class TeamsViewSet(viewsets.ModelViewSet):
    queryset = Teams.objects.all()
    serializer_class = TeamsSerializer
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return Teams.objects.filter(teammembers__user_id=user_id)
        return Teams.objects.all()

class TeamMembersViewSet(viewsets.ModelViewSet):
    queryset = TeamMembers.objects.all()
    serializer_class = TeamMembersSerializer
    def get_queryset(self):
        team_id = self.request.query_params.get('team_id')
        if team_id:
            return TeamMembers.objects.filter(team_id=team_id)
        return TeamMembers.objects.all()

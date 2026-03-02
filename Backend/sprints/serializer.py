from rest_framework import serializers
from .models import Sprints, SprintTasks

class SprintsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sprints
        fields = ['sprint_id', 'project_id', 'team_id', 'name', 'description', 'start_date', 'end_date']

class SprintTasksSerializer(serializers.ModelSerializer):
    class Meta:
        model = SprintTasks
        fields = ['sprint_task_id', 'sprint_id', 'name', 'description', 'status', 'assignee']
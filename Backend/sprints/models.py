from django.db import models

class Sprints(models.Model):
    sprint_id = models.AutoField(primary_key=True)
    project_id = models.ForeignKey('projects.Projects', on_delete=models.CASCADE)
    team_id = models.ForeignKey('teams.Teams', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.name
    
class SprintTasks(models.Model):
    task_status = (
        ('To Do', 'To Do'),
        ('In Progress', 'In Progress'),
        ('Done', 'Done'),
        ('Blocked', 'Blocked'),
    )
    sprint_task_id = models.AutoField(primary_key=True)
    sprint_id = models.ForeignKey(Sprints, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=50, choices=task_status)
    assignee = models.ForeignKey('accounts.Users', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

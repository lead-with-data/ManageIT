from django.db import models

class Projects(models.Model):
    project_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey('accounts.Users', on_delete=models.CASCADE)
    team_id = models.ForeignKey('teams.Teams', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.name

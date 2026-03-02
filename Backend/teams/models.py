from django.db import models

class Teams(models.Model):
    team_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name
    
class TeamMembers(models.Model):
    roles = (
        ('Manager', 'Manager'),
        ('Developer', 'Developer'),
        ('Tester', 'Tester'),
        ('Member', 'Member'),
    )
    team_member_id = models.AutoField(primary_key=True)
    team_id = models.ForeignKey(Teams, on_delete=models.CASCADE)
    user_id = models.ForeignKey('accounts.Users', on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=roles)

    def __str__(self):
        return f"{self.user_id.name} - {self.team_id.name}"

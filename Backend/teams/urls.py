from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamsViewSet, TeamMembersViewSet

router = DefaultRouter()
router.register(r'teams', TeamsViewSet)
router.register(r'team-members', TeamMembersViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

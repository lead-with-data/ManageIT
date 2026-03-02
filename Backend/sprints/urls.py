from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SprintsViewSet, SprintTasksViewSet

router = DefaultRouter()
router.register(r'sprints', SprintsViewSet)
router.register(r'sprint-tasks', SprintTasksViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

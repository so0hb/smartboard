from django.urls import path
from .views import RegisterView, LoginView
from django.urls import path
from .views import GetAllUsersView, UpdateUserView, DeleteUserView, DeleteAllUsersView

urlpatterns = [
    path('users/', GetAllUsersView.as_view(), name='get_all_users'),
    path('users/<int:user_id>/', UpdateUserView.as_view(), name='update_user'),
    path('<int:user_id>/', DeleteUserView.as_view(), name='delete_user'),
    path('users/delete-all/', DeleteAllUsersView.as_view(), name='delete_all_users'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]


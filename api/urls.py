from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.get_users, name='get_users'),
    path('users/create/', views.create_user, name='create_user'),
    path('categories/', views.get_categories, name='get_categories'),
    path('categories/create/', views.create_category, name='create_category'),
    path('expenses/', views.get_expenses, name='get_expenses'),
    path('expenses/create/', views.create_expense, name='create_expense'),
    path('reports/monthly_summary/', views.monthly_summary, name='monthly_summary'),
]

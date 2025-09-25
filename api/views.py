from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, Category, Expense
from .serializers import UserSerializer, CategorySerializer, ExpenseSerializer
from django.db.models import Sum

# Users
@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# Categories
@api_view(['POST'])
def create_category(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

# Expenses
@api_view(['POST'])
def create_expense(request):
    serializer = ExpenseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['GET'])
def get_expenses(request):
    user_id = request.GET.get('user_id')
    expenses = Expense.objects.filter(user_id=user_id).order_by('-date')
    serializer = ExpenseSerializer(expenses, many=True)
    return Response(serializer.data)

# Monthly Summary Report
@api_view(['GET'])
def monthly_summary(request):
    user_id = request.GET.get('user_id')
    year = request.GET.get('year')
    month = request.GET.get('month')

    expenses = Expense.objects.filter(
        user_id=user_id,
        date__year=year,
        date__month=month
    )

    total = expenses.aggregate(Sum('amount'))['amount__sum'] or 0
    category_summary = expenses.values('category__name').annotate(total_amount=Sum('amount'))

    result = {
        "total_expenses": str(total),
        "expenses_by_category": [
            {"category_name": c['category__name'], "total_amount": str(c['total_amount'])}
            for c in category_summary
        ]
    }
    return Response(result)

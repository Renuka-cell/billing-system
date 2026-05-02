from django.urls import path
from .views import create_invoice, search_customer, customer_history, login_user, admin_dashboard
from .views import login_user
from .views import download_invoice

urlpatterns = [
    path('login/', login_user),
    path('create-invoice/', create_invoice),
    path('search-customer/', search_customer),
    path('customer-history/<str:mobile>/', customer_history),
    path('admin-dashboard/', admin_dashboard),
    path('download-invoice/<int:invoice_id>/', download_invoice),
    path('admin-dashboard/', admin_dashboard),
]
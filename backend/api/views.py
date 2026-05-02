from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Customer, Invoice, UserProfile
from .pdf_utils import generate_invoice_pdf
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import admin_only
from django.http import FileResponse
import os
from django.conf import settings
from django.db.models import Sum
from datetime import date
from .permissions import admin_only
from rest_framework.permissions import IsAuthenticated



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_only
def admin_dashboard(request):
    return Response({"message": "Welcome Admin"})

# ✅ Create Invoice (no role restriction)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_invoice(request):
    data = request.data

    customer, created = Customer.objects.get_or_create(
        mobile=data['mobile'],
        defaults={
            'name': data['name'],
            'email': data['email']
        }
    )

    total = int(data['quantity']) * float(data['rate'])

    invoice = Invoice.objects.create(
        customer=customer,
        product_description=data['product_description'],
        quantity=data['quantity'],
        rate=data['rate'],
        total_amount=total
    )

    pdf_path = generate_invoice_pdf(invoice)

    return Response({
        "message": "Invoice created successfully",
        "invoice_id": invoice.id,
        "total_amount": total,
        "pdf": pdf_path
    })


# ✅ Search Customer
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_customer(request):
    query = request.GET.get('query')

    customer = Customer.objects.filter(mobile=query).first()

    if customer:
        return Response({
            "name": customer.name,
            "email": customer.email,
            "mobile": customer.mobile
        })

    return Response({"message": "Customer not found"})


# ✅ Customer History
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customer_history(request, mobile):
    customer = Customer.objects.filter(mobile=mobile).first()

    if not customer:
        return Response({"message": "Customer not found"})

    invoices = Invoice.objects.filter(customer=customer)

    data = []
    for inv in invoices:
        data.append({
            "date": inv.date,
            "product": inv.product_description,
            "amount": inv.total_amount
        })

    return Response(data)


# ✅ Login (UPDATED with role)
@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username=email, password=password)

    if user:
        #profile = UserProfile.objects.get(user=user)
        profile, created = UserProfile.objects.get_or_create(user=user)
        refresh = RefreshToken.for_user(user)

        return Response({
            "token": str(refresh.access_token),
            "role": profile.role,
            "message": "Login successful"
        })

    return Response({"error": "Invalid credentials"}, status=401)

# ✅ Download Invoice PDF
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_invoice(request, invoice_id):
    try:
        invoice = Invoice.objects.get(id=invoice_id)
    except Invoice.DoesNotExist:
        return Response({"error": "Invoice not found"}, status=404)

    file_name = f"invoice_{invoice.id}.pdf"
    file_path = os.path.join(settings.MEDIA_ROOT, file_name)

    if not os.path.exists(file_path):
        return Response({"error": "PDF not found"}, status=404)

    return FileResponse(open(file_path, 'rb'), content_type='application/pdf')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_only
def admin_dashboard(request):

    # Total sales
    total_sales = Invoice.objects.aggregate(total=Sum('total_amount'))['total'] or 0

    # Total invoices
    total_invoices = Invoice.objects.count()

    # Total customers
    total_customers = Customer.objects.count()

    # Today's sales
    today = date.today()
    today_sales = Invoice.objects.filter(date=today).aggregate(
        total=Sum('total_amount')
    )['total'] or 0

    return Response({
        "total_sales": total_sales,
        "total_invoices": total_invoices,
        "total_customers": total_customers,
        "today_sales": today_sales
    })
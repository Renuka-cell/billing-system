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

from datetime import date

from .serializers import InvoiceSerializer
from django.db.models import Sum
from django.contrib.auth.models import User


# =========================================
# ADMIN DASHBOARD
# =========================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_only
def admin_dashboard(request):

    total_sales = Invoice.objects.aggregate(
        total=Sum('total_amount')
    )['total'] or 0

    total_invoices = Invoice.objects.count()

    total_customers = Customer.objects.count()

    today = date.today()

    today_sales = Invoice.objects.filter(
        date=today
    ).aggregate(
        total=Sum('total_amount')
    )['total'] or 0

    return Response({
        "total_sales": total_sales,
        "total_invoices": total_invoices,
        "total_customers": total_customers,
        "today_sales": today_sales
    })


# =========================================
# CREATE INVOICE
# =========================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_invoice(request):

    try:

        data = request.data

        # =========================
        # CUSTOMER CREATE / GET
        # =========================
        customer, created = Customer.objects.get_or_create(
            mobile=data['mobile'],
            defaults={
                'name': data['name'],
                'email': data['email']
            }
        )

        # =========================
        # CALCULATIONS
        # =========================
        quantity = int(data['quantity'])

        rate = float(data['rate'])

        total = quantity * rate

        paid_amount = float(
            data.get('paid_amount', 0)
        )

        # =========================
        # CREATE INVOICE
        # =========================
        invoice = Invoice.objects.create(

            customer=customer,

            created_by=request.user,

            product_description=data[
                'product_description'
            ],

            quantity=quantity,

            rate=rate,

            total_amount=total,

            paid_amount=paid_amount,
        )

        # =========================
        # GENERATE PDF
        # =========================
        pdf_path = generate_invoice_pdf(invoice)

        # =========================
        # RESPONSE
        # =========================
        return Response({

            "message":
                "Invoice created successfully",

            "invoice_id":
                invoice.id,

            "invoice_number":
                invoice.invoice_number,

            "customer":
                customer.name,

            "total_amount":
                invoice.total_amount,

            "paid_amount":
                invoice.paid_amount,

            "due_amount":
                invoice.due_amount,

            "payment_status":
                invoice.payment_status,

            "pdf":
                pdf_path
        })

    except Exception as e:

        return Response({
            "error": str(e)
        }, status=400)


# =========================================
# SEARCH CUSTOMER
# =========================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_customer(request):

    query = request.GET.get('query')

    customer = Customer.objects.filter(
        mobile=query
    ).first()

    if customer:

        return Response({
            "name": customer.name,
            "email": customer.email,
            "mobile": customer.mobile
        })

    return Response({
        "message": "Customer not found"
    })


# =========================================
# CUSTOMER HISTORY
# =========================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customer_history(request, mobile):

    customer = Customer.objects.filter(
        mobile=mobile
    ).first()

    if not customer:

        return Response({
            "message": "Customer not found"
        })

    invoices = Invoice.objects.filter(
        customer=customer
    ).order_by('-created_at')

    data = []

    for inv in invoices:

        data.append({

            "invoice_id":
                inv.id,

            "invoice_number":
                inv.invoice_number,

            "date":
                inv.date,

            "product":
                inv.product_description,

            "quantity":
                inv.quantity,

            "rate":
                inv.rate,

            "total_amount":
                inv.total_amount,

            "paid_amount":
                inv.paid_amount,

            "due_amount":
                inv.due_amount,

            "payment_status":
                inv.payment_status,

            "download_url":
                f"/api/download-invoice/{inv.id}/"
        })

    return Response({
        "customer_name": customer.name,
        "customer_mobile": customer.mobile,
        "customer_email": customer.email,
        "history": data
    })


# =========================================
# LOGIN USER
# =========================================
@api_view(['POST'])
def login_user(request):

    email = request.data.get('email')

    password = request.data.get('password')

    user = authenticate(
        username=email,
        password=password
    )

    if user:

        profile, created = UserProfile.objects.get_or_create(
            user=user
        )

        refresh = RefreshToken.for_user(user)

        return Response({

            "access":
                str(refresh.access_token),

            "refresh":
                str(refresh),

            "role":
                profile.role,

            "message":
                "Login successful"
        })

    return Response({
        "error": "Invalid credentials"
    }, status=401)


# =========================================
# DOWNLOAD INVOICE
# =========================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_invoice(request, invoice_id):

    try:

        invoice = Invoice.objects.get(
            id=invoice_id
        )

    except Invoice.DoesNotExist:

        return Response({
            "error": "Invoice not found"
        }, status=404)

    file_name = f"invoice_{invoice.id}.pdf"

    file_path = os.path.join(
        settings.MEDIA_ROOT,
        file_name
    )

    # AUTO REGENERATE PDF IF MISSING
    if not os.path.exists(file_path):

        generate_invoice_pdf(invoice)

    return FileResponse(
        open(file_path, 'rb'),
        content_type='application/pdf'
    )


# =========================================
# UPDATE PAYMENT
# =========================================
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_payment(request, invoice_id):

    try:

        invoice = Invoice.objects.get(
            id=invoice_id
        )

    except Invoice.DoesNotExist:

        return Response({
            "error": "Invoice not found"
        }, status=404)

    try:

        additional_payment = float(
            request.data.get('amount', 0)
        )

        # =========================
        # VALIDATION
        # =========================
        if additional_payment <= 0:

            return Response({
                "error": "Payment amount must be greater than 0"
            }, status=400)

        # =========================
        # UPDATE PAYMENT
        # =========================
        invoice.paid_amount += additional_payment

        # Prevent overpayment
        if invoice.paid_amount > invoice.total_amount:

            invoice.paid_amount = invoice.total_amount

        # Auto recalculates:
        # due_amount
        # payment_status
        invoice.save()

        # =========================
        # REGENERATE PDF
        # =========================
        generate_invoice_pdf(invoice)

        return Response({

            "message":
                "Payment updated successfully",

            "invoice_id":
                invoice.id,

            "invoice_number":
                invoice.invoice_number,

            "total_amount":
                invoice.total_amount,

            "paid_amount":
                invoice.paid_amount,

            "due_amount":
                invoice.due_amount,

            "payment_status":
                invoice.payment_status
        })

    except Exception as e:

        return Response({
            "error": str(e)
        }, status=400)
    


# =========================================
# ALL INVOICES (ADMIN)
# =========================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_only
def all_invoices(request):

    invoices = Invoice.objects.select_related(
        'customer',
        'created_by'
    ).order_by('-created_at')

    data = []

    for inv in invoices:

        data.append({

            "invoice_id":
                inv.id,

            "invoice_number":
                inv.invoice_number,

            "customer_name":
                inv.customer.name,

            "customer_mobile":
                inv.customer.mobile,

            "date":
                inv.date,

            "product":
                inv.product_description,

            "total_amount":
                inv.total_amount,

            "paid_amount":
                inv.paid_amount,

            "due_amount":
                inv.due_amount,

            "payment_status":
                inv.payment_status,

            "created_by":
                inv.created_by.username
                if inv.created_by
                else "Unknown",

            "download_url":
                f"/api/download-invoice/{inv.id}/"
        })

    return Response(data)
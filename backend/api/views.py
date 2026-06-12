from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import (
    Customer,
    Invoice,
    UserProfile,
    ShopDetails
)
from .pdf_utils import generate_invoice_pdf

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken

from .permissions import admin_only

from django.http import FileResponse

import os
import re

from django.conf import settings

from datetime import date

from decimal import Decimal

from django.db.models import Sum

from django.contrib.auth.models import User
from .models import UserProfile
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    ShopDetailsSerializer
)

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

        "total_sales":
            total_sales,

        "total_invoices":
            total_invoices,

        "total_customers":
            total_customers,

        "today_sales":
            today_sales
    })


# =========================================
# CREATE INVOICE
# =========================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_invoice(request):

    try:

        data = request.data

        # =====================================
        # MOBILE VALIDATION
        # =====================================
        mobile = data.get(
            'mobile',
            ''
        ).strip()

        if not re.fullmatch(
            r'^[0-9]{10}$',
            mobile
        ):

            return Response({
                "error":
                    "Mobile number must be exactly 10 digits"
            }, status=400)

        # =====================================
        # EMAIL VALIDATION
        # =====================================
        email = data.get(
            'email',
            ''
        ).strip()

        if not re.fullmatch(
            r'^[\w\.-]+@[\w\.-]+\.\w+$',
            email
        ):

            return Response({
                "error":
                    "Invalid email format"
            }, status=400)

        # =====================================
        # CUSTOMER CREATE / GET
        # =====================================
        customer, created = Customer.objects.get_or_create(

            mobile=mobile,

            defaults={

                'name':
                    data.get('name'),

                'email':
                    email
            }
        )

        # =====================================
        # UPDATE CUSTOMER
        # =====================================
        customer.name = data.get('name')

        customer.email = email

        customer.save()

        # =====================================
        # FRAME VALUES
        # =====================================
        frame_type = data.get(
            'frame_type',
            'Not Required'
        )

        if frame_type == "Not Required":

            frame_quantity = 0

            frame_price = Decimal('0')

        else:

            frame_quantity = int(
                float(
                    data.get(
                        'frame_quantity',
                        1
                    )
                )
            )

            frame_price = Decimal(
                str(
                    data.get(
                        'frame_price',
                        0
                    )
                )
            )

        # =====================================
        # GLASS VALUES
        # =====================================
        glass_type = data.get(
            'glass_type',
            'Not Required'
        )

        if (
            glass_type == "Not Required"
            or glass_type == ""
        ):

            glass_type = "Not Required"

            glass_quantity = Decimal('0')

            glass_price = Decimal('0')

        else:

            glass_quantity = Decimal(
                str(
                    data.get(
                        'glass_quantity',
                        1
                    )
                )
            )

            glass_price = Decimal(
                str(
                    data.get(
                        'glass_price',
                        0
                    )
                )
            )

        # =====================================
        # LENS TYPE
        # =====================================
        lens_type = data.get(
            'lens_type',
            'Not Required'
        )

        if (
            lens_type == ""
            or lens_type is None
        ):

            lens_type = "Not Required"

        # =====================================
        # PAYMENT
        # =====================================
        paid_amount = Decimal(
            str(
                data.get(
                    'paid_amount',
                    0
                )
            )
        )

        # =====================================
        # CREATE INVOICE
        # =====================================
        invoice = Invoice.objects.create(

            customer=customer,

            created_by=request.user,

            # =====================================
            # FRAME
            # =====================================
            frame_type=frame_type,

            frame_quantity=frame_quantity,

            frame_price=frame_price,

            # =====================================
            # GLASS
            # =====================================
            glass_type=glass_type,

            glass_quantity=glass_quantity,

            glass_price=glass_price,

            # =====================================
            # LENS
            # =====================================
            lens_type=lens_type,

            # =====================================
            # PAYMENT
            # =====================================
            paid_amount=paid_amount,

            payment_mode=data.get(
                'payment_mode',
                'Cash'
            ),

            # =====================================
            # RIGHT EYE
            # =====================================
            right_sph=data.get(
                'right_sph',
                ''
            ),

            right_cyl=data.get(
                'right_cyl',
                ''
            ),

            right_axis=data.get(
                'right_axis',
                ''
            ),

            right_add=data.get(
                'right_add',
                ''
            ),

            # =====================================
            # LEFT EYE
            # =====================================
            left_sph=data.get(
                'left_sph',
                ''
            ),

            left_cyl=data.get(
                'left_cyl',
                ''
            ),

            left_axis=data.get(
                'left_axis',
                ''
            ),

            left_add=data.get(
                'left_add',
                ''
            ),
        )

        # =====================================
        # GENERATE PDF
        # =====================================
        pdf_path = generate_invoice_pdf(
            invoice
        )

        # =====================================
        # RESPONSE
        # =====================================
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

        print(
            "CREATE INVOICE ERROR:",
            str(e)
        )

        return Response({

            "error":
                str(e)

        }, status=400)


# =========================================
# SEARCH CUSTOMER
# =========================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_customer(request):

    name = request.GET.get(
        'name',
        ''
    ).strip()

    mobile = request.GET.get(
        'mobile',
        ''
    ).strip()

    customer = None

    # =====================================
    # SEARCH BY BOTH
    # =====================================
    if name and mobile:

        customer = Customer.objects.filter(
            name__icontains=name,
            mobile=mobile
        ).first()

    # =====================================
    # SEARCH ONLY BY MOBILE
    # =====================================
    elif mobile:

        customer = Customer.objects.filter(
            mobile=mobile
        ).first()

    # =====================================
    # SEARCH ONLY BY NAME
    # =====================================
    elif name:

        customer = Customer.objects.filter(
            name__icontains=name
        ).first()

    # =====================================
    # CUSTOMER FOUND
    # =====================================
    if customer:

        return Response({

            "name":
                customer.name,

            "email":
                customer.email,

            "mobile":
                customer.mobile
        })

    # =====================================
    # CUSTOMER NOT FOUND
    # =====================================
    return Response({

        "message":
            "Customer not found"

    }, status=404)


# =========================================
# CUSTOMER HISTORY
# =========================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customer_history(request):

    name = request.GET.get(
        'name',
        ''
    ).strip()

    mobile = request.GET.get(
        'mobile',
        ''
    ).strip()

    customer = None

    # =====================================
    # SEARCH BY BOTH
    # =====================================
    if name and mobile:

        customer = Customer.objects.filter(
            name__icontains=name,
            mobile=mobile
        ).first()

    # =====================================
    # SEARCH ONLY BY MOBILE
    # =====================================
    elif mobile:

        customer = Customer.objects.filter(
            mobile=mobile
        ).first()

    # =====================================
    # SEARCH ONLY BY NAME
    # =====================================
    elif name:

        customer = Customer.objects.filter(
            name__icontains=name
        ).first()

    # =====================================
    # CUSTOMER NOT FOUND
    # =====================================
    if not customer:

        return Response({

            "message":
                "Customer not found"

        }, status=404)

    invoices = Invoice.objects.filter(
        customer=customer
    ).order_by('-created_at')

    data = []

    for inv in invoices:

        data.append({

            "invoice_id":
                inv.id,

            "invoice_number":
                str(inv.invoice_number),

            "date":
                str(inv.date),

            "frame_type":
                inv.frame_type or "--",

            "frame_quantity":
                inv.frame_quantity,

            "frame_price":
                float(inv.frame_price),

            "glass_type":
                inv.glass_type or "--",

            "glass_quantity":
                float(inv.glass_quantity),

            "glass_price":
                float(inv.glass_price),

            "lens_type":
                inv.lens_type or "--",

            "total_amount":
                float(inv.total_amount),

            "paid_amount":
                float(inv.paid_amount),

            "due_amount":
                float(inv.due_amount),

            "payment_status":
                inv.payment_status,

            "payment_mode":
                inv.payment_mode,

            # RIGHT EYE
            "right_sph":
                inv.right_sph or "--",

            "right_cyl":
                inv.right_cyl or "--",

            "right_axis":
                inv.right_axis or "--",

            "right_add":
                inv.right_add or "--",

            # LEFT EYE
            "left_sph":
                inv.left_sph or "--",

            "left_cyl":
                inv.left_cyl or "--",

            "left_axis":
                inv.left_axis or "--",

            "left_add":
                inv.left_add or "--",

            "download_url":
                f"/api/download-invoice/{inv.id}/"
        })

    return Response({

        "customer_name":
            customer.name,

        "customer_mobile":
            customer.mobile,

        "customer_email":
            customer.email,

        "history":
            data
    })


# =========================================
# LOGIN USER
# =========================================
@api_view(['POST'])
def login_user(request):

    username = request.data.get('username')

    password = request.data.get('password')

    user = authenticate(    
        username=username,
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

            "username": user.username,

            "message":
                "Login successful"
        })

    return Response({

        "error":
            "Invalid credentials"

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

            "error":
                "Invoice not found"

        }, status=404)

    file_name = f"invoice_{invoice.id}.pdf"

    file_path = os.path.join(
        settings.MEDIA_ROOT,
        file_name
    )

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

            "error":
                "Invoice not found"

        }, status=404)

    try:

        additional_payment = Decimal(
            str(
                request.data.get(
                    'amount',
                    0
                )
            )
        )

        if additional_payment <= 0:

            return Response({

                "error":
                    "Payment amount must be greater than 0"

            }, status=400)

        invoice.paid_amount += additional_payment

        if invoice.paid_amount > invoice.total_amount:

            invoice.paid_amount = invoice.total_amount

        invoice.save()

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

            "error":
                str(e)

        }, status=400)


# =========================================
# ALL INVOICES
# =========================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_only
def all_invoices(request):

    try:

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
                    str(inv.invoice_number),

                "customer_name":
                    inv.customer.name,

                "customer_mobile":
                    inv.customer.mobile,

                "date":
                    str(inv.date),

                "frame_type":
                    inv.frame_type or "--",

                "frame_quantity":
                    inv.frame_quantity,

                "frame_price":
                    float(inv.frame_price),

                "glass_type":
                    inv.glass_type or "--",

                "glass_quantity":
                    float(inv.glass_quantity),

                "glass_price":
                    float(inv.glass_price),

                "lens_type":
                    inv.lens_type or "--",

                "total_amount":
                    float(inv.total_amount),

                "paid_amount":
                    float(inv.paid_amount),

                "due_amount":
                    float(inv.due_amount),

                "payment_status":
                    inv.payment_status,

                "payment_mode":
                    inv.payment_mode,

                # RIGHT EYE
                "right_sph":
                    inv.right_sph or "--",

                "right_cyl":
                    inv.right_cyl or "--",

                "right_axis":
                    inv.right_axis or "--",

                "right_add":
                    inv.right_add or "--",

                # LEFT EYE
                "left_sph":
                    inv.left_sph or "--",

                "left_cyl":
                    inv.left_cyl or "--",

                "left_axis":
                    inv.left_axis or "--",

                "left_add":
                    inv.left_add or "--",

                "created_by":
                    inv.created_by.username
                    if inv.created_by
                    else "Unknown",

                "download_url":
                    f"/api/download-invoice/{inv.id}/"
            })

        return Response(data)

    except Exception as e:

        print(
            "ALL INVOICES ERROR:",
            str(e)
        )

        return Response({

            "error":
                str(e)

        }, status=400)
    
# =========================================
# EDIT / UPDATE INVOICE
# =========================================
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_invoice(request, invoice_id):

    try:

        invoice = Invoice.objects.get(
            id=invoice_id
        )

    except Invoice.DoesNotExist:

        return Response({

            "error":
                "Invoice not found"

        }, status=404)

    try:

        data = request.data

        # =====================================
        # FRAME
        # =====================================
        frame_type = data.get(
            'frame_type',
            'Not Required'
        )

        invoice.frame_type = frame_type

        if frame_type == "Not Required":

            invoice.frame_quantity = 0

            invoice.frame_price = Decimal('0.00')

        else:

            invoice.frame_quantity = int(
                data.get(
                    'frame_quantity',
                    1
                )
            )

            invoice.frame_price = Decimal(
                str(
                    data.get(
                        'frame_price',
                        0
                    )
                )
            )

        # =====================================
        # GLASS
        # =====================================
        glass_type = data.get(
            'glass_type',
            'Not Required'
        )

        invoice.glass_type = glass_type

        if glass_type == "Not Required":

            invoice.glass_quantity = 0

            invoice.glass_price = Decimal('0.00')

        else:

            invoice.glass_quantity = Decimal(
                str(
                    data.get(
                        'glass_quantity',
                        1
                    )
                )
            )

            invoice.glass_price = Decimal(
                str(
                    data.get(
                        'glass_price',
                        0
                    )
                )
            )

        # =====================================
        # LENS TYPE
        # =====================================
        lens_type = data.get(
            'lens_type',
            'Not Required'
        )

        if (
            lens_type == ""
            or lens_type is None
        ):

            lens_type = "Not Required"

        invoice.lens_type = lens_type

        # =====================================
        # KEEP EXISTING PAYMENT DETAILS
        # =====================================
        # Edit invoice should NOT change payment.
        # Payment changes only from Update Payment.
        invoice.paid_amount = invoice.paid_amount

        invoice.payment_mode = invoice.payment_mode

        # =====================================
        # RIGHT EYE
        # =====================================
        invoice.right_sph = data.get(
            'right_sph',
            ''
        )

        invoice.right_cyl = data.get(
            'right_cyl',
            ''
        )

        invoice.right_axis = data.get(
            'right_axis',
            ''
        )

        invoice.right_add = data.get(
            'right_add',
            ''
        )

        # =====================================
        # LEFT EYE
        # =====================================
        invoice.left_sph = data.get(
            'left_sph',
            ''
        )

        invoice.left_cyl = data.get(
            'left_cyl',
            ''
        )

        invoice.left_axis = data.get(
            'left_axis',
            ''
        )

        invoice.left_add = data.get(
            'left_add',
            ''
        )

        # =====================================
        # SAVE
        # =====================================
        invoice.save()

        # =====================================
        # REGENERATE PDF
        # =====================================
        generate_invoice_pdf(invoice)

        return Response({

            "message":
                "Invoice updated successfully",

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

        print(
            "UPDATE INVOICE ERROR:",
            str(e)
        )

        return Response({

            "error":
                str(e)

        }, status=400)
    

# =========================================
# DELETE INVOICE
# =========================================
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@admin_only
def delete_invoice(request, invoice_id):

    try:

        invoice = Invoice.objects.get(
            id=invoice_id
        )

    except Invoice.DoesNotExist:

        return Response({

            "error":
                "Invoice not found"

        }, status=404)

    try:

        # =====================================
        # DELETE PDF FILE
        # =====================================
        pdf_file = os.path.join(
            settings.MEDIA_ROOT,
            f"invoice_{invoice.id}.pdf"
        )

        if os.path.exists(pdf_file):

            os.remove(pdf_file)

        # =====================================
        # DELETE INVOICE
        # =====================================
        invoice.delete()

        return Response({

            "message":
                "Invoice deleted successfully"

        })

    except Exception as e:

        print(
            "DELETE INVOICE ERROR:",
            str(e)
        )

        return Response({

            "error":
                str(e)

        }, status=400)
    


@api_view(['POST'])
def create_staff(request):

    try:

        if (
            not hasattr(request.user, "userprofile")
            or request.user.userprofile.role != "admin"
        ):
            return Response(
                {"error": "Admin access required"},
                status=403
            )

        username = request.data.get("username")

        password = request.data.get("password")
        # ==========================
        # PASSWORD VALIDATION
        # ==========================
        password_regex = (
            r'^(?=.*[a-z])'
            r'(?=.*[A-Z])'
            r'(?=.*\d)'
            r'.{8,}$'
        )

        if not re.match(
            password_regex,
            password
        ):

            return Response(
                {
                    "error":
                    "Password must contain minimum 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number"
                },
                status=400
            )

        if not username or not password:

            return Response(
                {"error": "Username and Password required"},
                status=400
            )

        if User.objects.filter(
            username=username
        ).exists():

            return Response(
                {"error": "Username already exists"},
                status=400
            )

        user = User.objects.create_user(
            username=username,
            password=password
        )

        profile = user.userprofile

        profile.role = "staff"

        profile.save()

        return Response({
            "message":
            "Staff created successfully"
        })

    except Exception as e:

        return Response(
            {"error": str(e)},
            status=500
        )
    

@api_view(['GET'])
def staff_list(request):

    try:

        if (
            not hasattr(request.user, "userprofile")
            or request.user.userprofile.role != "admin"
        ):
            return Response(
                {"error": "Admin access required"},
                status=403
            )

        staff_users = UserProfile.objects.filter(
            role="staff"
        )

        data = []

        for staff in staff_users:

            data.append({
                "id": staff.user.id,
                "username": staff.user.username,
                "role": staff.role
            })

        return Response(data)

    except Exception as e:

        return Response(
            {"error": str(e)},
            status=500
        )
    

@api_view(['DELETE'])
def delete_staff(request, user_id):

    try:

        if (
            not hasattr(request.user, "userprofile")
            or request.user.userprofile.role != "admin"
        ):
            return Response(
                {"error": "Admin access required"},
                status=403
            )

        user = User.objects.get(
            id=user_id
        )

        if (
            hasattr(user, "userprofile")
            and user.userprofile.role == "admin"
        ):
            return Response(
                {"error": "Cannot delete admin"},
                status=400
            )

        user.delete()

        return Response({
            "message":
            "Staff deleted successfully"
        })

    except User.DoesNotExist:

        return Response(
            {"error": "User not found"},
            status=404
        )

    except Exception as e:

        return Response(
            {"error": str(e)},
            status=500
        )
    

@api_view(['PUT'])
def update_staff(request, user_id):

    try:

        if (
            not hasattr(request.user, "userprofile")
            or request.user.userprofile.role != "admin"
        ):
            return Response(
                {"error": "Admin access required"},
                status=403
            )

        user = User.objects.get(
            id=user_id
        )

        username = request.data.get(
            "username"
        )

        if not username:

            return Response(
                {"error": "Username required"},
                status=400
            )

        existing_user = User.objects.filter(
            username=username
        ).exclude(
            id=user_id
        )

        if existing_user.exists():

            return Response(
                {
                    "error":
                    "Username already exists"
                },
                status=400
            )

        user.username = username

        user.save()

        return Response({
            "message":
            "Staff updated successfully"
        })

    except User.DoesNotExist:

        return Response(
            {"error": "User not found"},
            status=404
        )

    except Exception as e:

        return Response(
            {"error": str(e)},
            status=500
        )
    

@api_view(['PUT'])
def reset_staff_password(
    request,
    user_id
):

    try:

        if (
            not hasattr(request.user, "userprofile")
            or request.user.userprofile.role != "admin"
        ):
            return Response(
                {"error": "Admin access required"},
                status=403
            )

        user = User.objects.get(
            id=user_id
        )

        new_password = request.data.get(
            "password"
        )

        if not new_password:

            return Response(
                {"error": "Password required"},
                status=400
            )

        # ==========================
        # PASSWORD VALIDATION
        # ==========================
        password_regex = (
            r'^(?=.*[a-z])'
            r'(?=.*[A-Z])'
            r'(?=.*\d)'
            r'.{8,}$'
        )

        if not re.match(
            password_regex,
            new_password
        ):

            return Response(
                {
                    "error":
                    "Password must contain minimum 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number"
                },
                status=400
            )

        if not new_password:

            return Response(
                {"error": "Password required"},
                status=400
            )

        user.set_password(
            new_password
        )

        user.save()

        return Response({
            "message":
            "Password updated successfully"
        })

    except User.DoesNotExist:

        return Response(
            {"error": "User not found"},
            status=404
        )

    except Exception as e:

        return Response(
            {"error": str(e)},
            status=500
        )
    

# =========================================
# SHOP SETTINGS
# =========================================
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
@admin_only
def shop_settings(request):

    shop = ShopDetails.objects.first()

    if request.method == "GET":

        if not shop:

            return Response({})

        serializer = ShopDetailsSerializer(shop)

        return Response(serializer.data)

    if request.method == "PUT":

        if not shop:

            shop = ShopDetails.objects.create(
                shop_name="My Optical Shop",
                address="",
                phone="",
                email=""
            )

        serializer = ShopDetailsSerializer(
            shop,
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response({
                "message":
                "Shop details updated successfully"
            })

        return Response(
            serializer.errors,
            status=400
        )
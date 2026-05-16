from django.db import models
import uuid
from decimal import Decimal

from django.contrib.auth.models import User


# =========================
# USER PROFILE MODEL
# =========================
class UserProfile(models.Model):

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='admin'
    )

    def __str__(self):

        return f"{self.user.username} - {self.role}"


# =========================
# CUSTOMER MODEL
# =========================
class Customer(models.Model):

    name = models.CharField(
        max_length=100
    )

    mobile = models.CharField(
        max_length=15,
        unique=True
    )

    email = models.EmailField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.name


# =========================
# INVOICE MODEL
# =========================
class Invoice(models.Model):

    PAYMENT_STATUS = (
        ('PAID', 'Paid'),
        ('PENDING', 'Pending'),
        ('PARTIAL', 'Partial'),
    )

    PAYMENT_MODES = (
        ('Cash', 'Cash'),
        ('UPI', 'UPI'),
        ('Card', 'Card'),
        ('Net Banking', 'Net Banking'),
    )

    # =========================================
    # FRAME TYPES
    # =========================================
    FRAME_TYPES = (
        ('Metal', 'Metal'),
        ('Plastic', 'Plastic'),
        ('Three-pic', 'Three-pic'),
        ('Carbon', 'Carbon'),
        ('Supra', 'Supra'),
        ('Goggle', 'Goggle'),
        ('Others', 'Others'),
        ('Not Required', 'Not Required'),
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    invoice_number = models.CharField(
        max_length=50,
        unique=True,
        default=uuid.uuid4
    )

    # =========================================
    # FRAME DETAILS
    # =========================================
    frame_type = models.CharField(
        max_length=100,
        choices=FRAME_TYPES,
        default='Not Required'
    )

    frame_quantity = models.IntegerField(
        default=0
    )

    frame_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )

    # =========================================
    # GLASS DETAILS
    # =========================================
    glass_type = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        default='Not Required'
    )

    glass_quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )

    glass_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )

    # =========================================
    # LENS TYPE
    # =========================================
    lens_type = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        default='Not Required'
    )

    # =========================================
    # PAYMENT
    # =========================================
    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00')
    )

    paid_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00')
    )

    due_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00')
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default='PENDING'
    )

    payment_mode = models.CharField(
        max_length=30,
        choices=PAYMENT_MODES,
        default='Cash'
    )

    # =========================================
    # RIGHT EYE
    # =========================================
    right_sph = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    right_cyl = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    right_axis = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    right_add = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    # =========================================
    # LEFT EYE
    # =========================================
    left_sph = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    left_cyl = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    left_axis = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    left_add = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    # =========================================
    # DATES
    # =========================================
    date = models.DateField(
        auto_now_add=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    # =========================================
    # SAVE METHOD
    # =========================================
    def save(self, *args, **kwargs):

        # =====================================
        # FRAME NOT REQUIRED
        # =====================================
        if self.frame_type == "Not Required":

            self.frame_quantity = 0
            self.frame_price = Decimal('0.00')

        # =====================================
        # GLASS NOT REQUIRED
        # =====================================
        if (
            self.glass_type == "Not Required"
            or not self.glass_type
        ):

            self.glass_quantity = Decimal('0.00')
            self.glass_price = Decimal('0.00')

        # =====================================
        # SAFE DECIMAL CONVERSION
        # =====================================
        frame_quantity = Decimal(
            str(self.frame_quantity or 0)
        )

        frame_price = Decimal(
            str(self.frame_price or 0)
        )

        glass_quantity = Decimal(
            str(self.glass_quantity or 0)
        )

        glass_price = Decimal(
            str(self.glass_price or 0)
        )

        paid_amount = Decimal(
            str(self.paid_amount or 0)
        )

        # =====================================
        # TOTALS
        # =====================================
        frame_total = (
            frame_quantity * frame_price
        )

        glass_total = (
            glass_quantity * glass_price
        )

        self.total_amount = (
            frame_total + glass_total
        ).quantize(Decimal('0.01'))

        self.paid_amount = (
            paid_amount
        ).quantize(Decimal('0.01'))

        self.due_amount = (
            self.total_amount
            - self.paid_amount
        ).quantize(Decimal('0.01'))

        # =====================================
        # AVOID NEGATIVE DUE
        # =====================================
        if self.due_amount < 0:

            self.due_amount = Decimal('0.00')

        # =====================================
        # PAYMENT STATUS
        # =====================================
        if self.paid_amount <= 0:

            self.payment_status = 'PENDING'

        elif self.paid_amount < self.total_amount:

            self.payment_status = 'PARTIAL'

        else:

            self.payment_status = 'PAID'

        super().save(*args, **kwargs)

    def __str__(self):

        return str(self.invoice_number)


# =========================
# AUTO CREATE USER PROFILE
# =========================
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=User)
def create_user_profile(
    sender,
    instance,
    created,
    **kwargs
):

    if created:

        UserProfile.objects.create(
            user=instance
        )
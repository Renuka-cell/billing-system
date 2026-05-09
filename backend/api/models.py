from django.db import models
import uuid
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

    name = models.CharField(max_length=100)

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

    product_description = models.TextField()

    quantity = models.IntegerField()

    rate = models.FloatField()

    total_amount = models.FloatField()

    # NEW FIELDS
    paid_amount = models.FloatField(default=0)

    due_amount = models.FloatField(default=0)

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default='PENDING'
    )

    date = models.DateField(
        auto_now_add=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):

        # Calculate Due Amount
        self.due_amount = (
            self.total_amount - self.paid_amount
        )

        # Auto Payment Status
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
def create_user_profile(sender, instance, created, **kwargs):

    if created:

        UserProfile.objects.create(
            user=instance
        )
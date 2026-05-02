from django.db import models
import uuid
from django.contrib.auth.models import User

# ✅ NEW: Role Model
class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='admin')

    def __str__(self):
        return f"{self.user.username} - {self.role}"


# ✅ Customer Model (UNCHANGED)
class Customer(models.Model):
    name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15, unique=True)
    email = models.EmailField()

    def __str__(self):
        return self.name


# ✅ Invoice Model (UNCHANGED)
class Invoice(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    product_description = models.TextField()
    quantity = models.IntegerField()
    rate = models.FloatField()
    total_amount = models.FloatField()
    date = models.DateField(auto_now_add=True)
    invoice_number = models.CharField(max_length=50, unique=True, default=uuid.uuid4)

    def __str__(self):
        return self.invoice_number


# ✅ AUTO CREATE PROFILE
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
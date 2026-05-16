'''from rest_framework import serializers
from .models import Customer, Invoice


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = '__all__'


class InvoiceSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source='customer.name',
        read_only=True
    )

    customer_mobile = serializers.CharField(
        source='customer.mobile',
        read_only=True
    )

    customer_email = serializers.CharField(
        source='customer.email',
        read_only=True
    )

    created_by_username = serializers.CharField(
        source='created_by.username',
        read_only=True
    )

    class Meta:
        model = Invoice

        fields = [
            'id',
            'invoice_number',

            'customer',
            'customer_name',
            'customer_mobile',
            'customer_email',

            'created_by',
            'created_by_username',

            'product_description',
            'quantity',
            'rate',

            'total_amount',
            'paid_amount',
            'due_amount',
            'payment_status',

            'date',
            'created_at',
            'updated_at',
        ]'''



from rest_framework import serializers

from .models import Customer, Invoice


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = '__all__'


class InvoiceSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source='customer.name',
        read_only=True
    )

    customer_mobile = serializers.CharField(
        source='customer.mobile',
        read_only=True
    )

    customer_email = serializers.CharField(
        source='customer.email',
        read_only=True
    )

    created_by_username = serializers.CharField(
        source='created_by.username',
        read_only=True
    )

    class Meta:

        model = Invoice

        fields = '__all__'


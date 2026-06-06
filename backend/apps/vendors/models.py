from django.db import models
from django.conf import settings


class Vendor(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Pending', 'Pending'),
        ('Blocked', 'Blocked'),
    )
    CATEGORY_CHOICES = (
        ('IT', 'IT'),
        ('Construction', 'Construction'),
        ('Furniture', 'Furniture'),
        ('Logistics', 'Logistics'),
        ('Raw Materials', 'Raw Materials'),
        ('Office Supplies', 'Office Supplies'),
        ('Other', 'Other'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='vendor_profile',
        help_text='Links this vendor profile to a login user account'
    )
    vendor_name = models.CharField(max_length=255)
    category = models.CharField(max_length=255, choices=CATEGORY_CHOICES, default='Other')
    gst_no = models.CharField(max_length=15)
    contact_no = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.vendor_name

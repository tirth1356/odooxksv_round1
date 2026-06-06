from django.db import models
from django.conf import settings
from apps.vendors.models import Vendor


class RFQ(models.Model):
    STATUS_CHOICES = (
        ('Draft', 'Draft'),
        ('Open', 'Open'),
        ('Approved', 'Approved'),
        ('Closed', 'Closed'),
    )
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    deadline = models.DateField()
    description = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
    assigned_vendors = models.ManyToManyField(Vendor, related_name='assigned_rfqs', blank=True)
    accepted_vendors = models.ManyToManyField(Vendor, related_name='accepted_rfqs', blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_rfqs',
        help_text='The Procurement Officer who created this RFQ'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class RFQLineItem(models.Model):
    rfq = models.ForeignKey(RFQ, related_name='line_items', on_delete=models.CASCADE)
    item = models.CharField(max_length=255)
    qty = models.IntegerField()
    unit = models.CharField(max_length=50, default='NOS')

    def __str__(self):
        return f"{self.item} x {self.qty}"


class Quotation(models.Model):
    STATUS_CHOICES = (
        ('Submitted', 'Submitted'),
        ('Under Review', 'Under Review'),
        ('Selected', 'Selected'),
        ('Rejected', 'Rejected'),
        ('Approved', 'Approved'),
    )
    rfq = models.ForeignKey(RFQ, related_name='quotations', on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, related_name='quotations', on_delete=models.CASCADE)
    price_per_unit = models.DecimalField(max_digits=12, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_days = models.PositiveIntegerField()
    vendor_notes = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Submitted')
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Quotation by {self.vendor.vendor_name} for {self.rfq.title}"

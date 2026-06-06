from django.db import models
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

    def __str__(self):
        return self.title

class RFQLineItem(models.Model):
    rfq = models.ForeignKey(RFQ, related_name='line_items', on_delete=models.CASCADE)
    item = models.CharField(max_length=255)
    qty = models.IntegerField()
    unit = models.CharField(max_length=50, default='NOS')

    def __str__(self):
        return f"{self.item} x {self.qty}"

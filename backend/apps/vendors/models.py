from django.db import models

class Vendor(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Pending', 'Pending'),
        ('Blocked', 'Blocked'),
    )
    vendor_name = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    gst_no = models.CharField(max_length=15)
    contact_no = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')

    def __str__(self):
        return self.vendor_name

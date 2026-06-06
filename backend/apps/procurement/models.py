from django.db import models
from django.conf import settings
from apps.rfqs.models import Quotation
from apps.vendors.models import Vendor


class Approval(models.Model):
    STATUS_CHOICES = (
        ('L2 Pending', 'L2 Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    )
    quotation = models.ForeignKey(
        Quotation,
        on_delete=models.CASCADE,
        related_name='approvals',
        help_text='The quotation being approved'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='L2 Pending')
    remarks = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Approval for {self.quotation} - {self.status}"


class ApprovalStep(models.Model):
    approval = models.ForeignKey(Approval, related_name='approval_chain', on_delete=models.CASCADE)
    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approval_steps',
        help_text='The user responsible for this approval step'
    )
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    info = models.CharField(max_length=255, blank=True, default='')

    def __str__(self):
        return f"{self.name} - {self.status}"


class PurchaseOrder(models.Model):
    STATUS_CHOICES = (
        ('Issued', 'Issued'),
        ('Acknowledged', 'Acknowledged'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )
    po_number = models.CharField(max_length=50, unique=True)
    quotation = models.OneToOneField(
        Quotation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='purchase_order',
        help_text='The approved quotation that generated this PO'
    )
    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='purchase_orders',
        help_text='The vendor this PO is issued to'
    )
    date = models.DateField()
    delivery_date = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Issued')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    grand_total = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.po_number


class POItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, related_name='items', on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    qty = models.IntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.description} for {self.purchase_order.po_number}"


class POTimelineEvent(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, related_name='timeline', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=True)
    is_error = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.timestamp}"


class Invoice(models.Model):
    STATUS_CHOICES = (
        ('Pending Payment', 'Pending Payment'),
        ('Paid', 'Paid'),
        ('Cancelled', 'Cancelled'),
    )
    invoice_number = models.CharField(max_length=50, unique=True)
    purchase_order = models.OneToOneField(
        PurchaseOrder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='invoice',
        help_text='The PO this invoice is generated from'
    )
    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='invoices',
        help_text='The vendor this invoice belongs to'
    )
    date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending Payment')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    cgst = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sgst = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.invoice_number


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='items', on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    qty = models.IntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.description} for {self.invoice.invoice_number}"


class InvoiceTimelineEvent(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='timeline', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=True)
    is_error = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.timestamp}"


class ActivityLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='activity_logs',
        help_text='The user who performed the action'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} - {self.category}"

class Quotation(models.Model):
    rfq_id = models.CharField(max_length=50)
    tax_rate = models.FloatField(default=18.0)
    validity = models.CharField(max_length=100, default='30 Days')
    payment_terms = models.TextField(blank=True, default='')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    gst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    grand_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    status = models.CharField(max_length=50, default='Submitted')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Quote for RFQ {self.rfq_id} - {self.status}"

class QuotationLineItem(models.Model):
    quotation = models.ForeignKey(Quotation, related_name='line_items', on_delete=models.CASCADE)
    desc = models.CharField(max_length=255)
    qty = models.IntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_days = models.IntegerField(default=10)

    def __str__(self):
        return f"{self.desc} - Price: {self.unit_price}"

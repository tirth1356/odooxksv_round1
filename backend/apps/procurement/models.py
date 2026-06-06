from django.db import models

class Approval(models.Model):
    STATUS_CHOICES = (
        ('L2 Pending', 'L2 Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    )
    rfq_title = models.CharField(max_length=255)
    vendor = models.CharField(max_length=255)
    amount = models.CharField(max_length=50)
    delivery_days = models.CharField(max_length=50)
    rating = models.CharField(max_length=10, default="4.5")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='L2 Pending')
    remarks = models.TextField(blank=True, default='')

    def __str__(self):
        return f"Approval for {self.rfq_title} - {self.status}"

class ApprovalStep(models.Model):
    approval = models.ForeignKey(Approval, related_name='approval_chain', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    info = models.CharField(max_length=255, blank=True, default='')

    def __str__(self):
        return f"{self.name} - {self.status}"

class PurchaseOrder(models.Model):
    po_number = models.CharField(max_length=50, unique=True)
    vendor_name = models.CharField(max_length=255, default='Infra Supplies Pvt Ltd')
    date = models.CharField(max_length=50)
    delivery_date = models.CharField(max_length=50)
    status = models.CharField(max_length=50, default='Issued')
    subtotal = models.CharField(max_length=50)
    grand_total = models.CharField(max_length=50)

    def __str__(self):
        return self.po_number

class POItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, related_name='items', on_delete=models.CASCADE)
    desc = models.CharField(max_length=255)
    qty = models.IntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.desc} for {self.purchase_order.po_number}"

class POTimelineEvent(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, related_name='timeline', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    time = models.CharField(max_length=50)
    completed = models.BooleanField(default=True)
    isError = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.time}"

class Invoice(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True)
    vendor_name = models.CharField(max_length=255, default='Infra Supplies Pvt Ltd')
    date = models.CharField(max_length=50)
    due_date = models.CharField(max_length=50)
    status = models.CharField(max_length=50, default='Pending Payment')
    subtotal = models.CharField(max_length=50)
    cgst = models.CharField(max_length=50)
    sgst = models.CharField(max_length=50)
    grand_total = models.CharField(max_length=50)

    def __str__(self):
        return self.invoice_number

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='items', on_delete=models.CASCADE)
    desc = models.CharField(max_length=255)
    qty = models.IntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.desc} for {self.invoice.invoice_number}"

class InvoiceTimelineEvent(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='timeline', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    time = models.CharField(max_length=50)
    completed = models.BooleanField(default=True)
    isError = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.time}"

class ActivityLog(models.Model):
    title = models.CharField(max_length=255)
    desc = models.TextField()
    category = models.CharField(max_length=50)
    time = models.CharField(max_length=50)

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

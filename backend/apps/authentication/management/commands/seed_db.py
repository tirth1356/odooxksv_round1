from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.vendors.models import Vendor
from apps.rfqs.models import RFQ, RFQLineItem
from apps.procurement.models import (
    Approval,
    ApprovalStep,
    PurchaseOrder,
    POItem,
    POTimelineEvent,
    Invoice,
    InvoiceItem,
    InvoiceTimelineEvent,
    ActivityLog,
)

class Command(BaseCommand):
    help = 'Seeds database with default users, vendors, RFQs, POs, Invoices, Approvals and Logs.'

    def handle(self, *args, **options):
        self.stdout.write("Flushing database tables...")
        get_user_model().objects.exclude(is_superuser=True).delete()
        Vendor.objects.all().delete()
        RFQ.objects.all().delete()
        RFQLineItem.objects.all().delete()
        Approval.objects.all().delete()
        ApprovalStep.objects.all().delete()
        PurchaseOrder.objects.all().delete()
        POItem.objects.all().delete()
        POTimelineEvent.objects.all().delete()
        Invoice.objects.all().delete()
        InvoiceItem.objects.all().delete()
        InvoiceTimelineEvent.objects.all().delete()
        ActivityLog.objects.all().delete()

        # Seed default users
        User = get_user_model()
        users_to_create = [
            {
                'username': 'admin',
                'email': 'admin@erp.com',
                'first_name': 'System',
                'last_name': 'Admin',
                'role': 'Admin',
                'is_staff': True,
                'is_superuser': True,
            },
            {
                'username': 'manager',
                'email': 'manager@erp.com',
                'first_name': 'Sarah',
                'last_name': 'Manager',
                'role': 'Manager',
            },
            {
                'username': 'officer',
                'email': 'officer@erp.com',
                'first_name': 'John',
                'last_name': 'Officer',
                'role': 'Procurement Officer',
            },
            {
                'username': 'vendor',
                'email': 'vendor@erp.com',
                'first_name': 'Acme',
                'last_name': 'Vendor',
                'role': 'Vendor',
                'country': 'India',
                'additional_information': 'Pre-seeded demo vendor',
            },
        ]
        for user_data in users_to_create:
            username = user_data.pop('username')
            email = user_data.pop('email')
            password = 'Password123'
            
            if not User.objects.filter(username=username).exists() and not User.objects.filter(email=email).exists():
                role = user_data.pop('role')
                is_superuser = user_data.pop('is_superuser', False)
                is_staff = user_data.pop('is_staff', False)
                
                if is_superuser:
                    User.objects.create_superuser(
                        username=username,
                        email=email,
                        password=password,
                        **user_data
                    )
                else:
                    User.objects.create_user(
                        username=username,
                        email=email,
                        password=password,
                        role=role,
                        **user_data
                    )
                self.stdout.write(self.style.SUCCESS(f"Successfully seeded user: {username} ({role})"))

        # Seed default vendors
        v1 = Vendor.objects.create(vendor_name="Infra Supplies Pvt Ltd", category="Construction", gst_no="27AABCS1429Bz0", contact_no="+91-98765-43210", status="Active")
        v2 = Vendor.objects.create(vendor_name="Techcore LTD", category="IT", gst_no="27AABCS1429Bz0", contact_no="+91-98765-43211", status="Active")
        v3 = Vendor.objects.create(vendor_name="OfficeNeed Co", category="Furniture", gst_no="27AABCS1429Bz2", contact_no="+91-98765-43212", status="Pending")
        v4 = Vendor.objects.create(vendor_name="FastLog Transport", category="logistics", gst_no="27AABCS1429Bz0", contact_no="+91-98765-43213", status="Blocked")
        self.stdout.write(self.style.SUCCESS("Successfully seeded default vendors."))

        # Seed default RFQ
        rfq = RFQ.objects.create(
            title="Office Furniture procurement Q2",
            category="Furniture",
            deadline="2026-06-15",
            description="Ergonomic chairs and standing desks for 3rd floor",
            status="Open"
        )
        rfq.assigned_vendors.add(v1, v2)
        
        RFQLineItem.objects.create(rfq=rfq, item="Ergonomic chair", qty=25, unit="NOS")
        RFQLineItem.objects.create(rfq=rfq, item="Standing desks", qty=10, unit="NOS")
        self.stdout.write(self.style.SUCCESS("Successfully seeded default RFQ."))

        # Seed default Approval
        appr = Approval.objects.create(
            rfq_title="Office Furniture Q2",
            vendor="Infra Supplies",
            amount="1,85,400",
            delivery_days="10 days",
            rating="4.5",
            status="L2 Pending",
            remarks=""
        )
        ApprovalStep.objects.create(approval=appr, name="Sarah Jenkins", role="L1 Procurement Officer", status="Approved", info="Submitted 2 hours ago")
        ApprovalStep.objects.create(approval=appr, name="Priya Shah", role="L2 Approver (Procurement Manager)", status="Awaiting", info="Assigned 1 hour ago")
        ApprovalStep.objects.create(approval=appr, name="David Chen", role="VP Operations / Final Signoff", status="Future", info="")
        self.stdout.write(self.style.SUCCESS("Successfully seeded approval workflow."))

        # Seed default PurchaseOrder
        po = PurchaseOrder.objects.create(
            po_number="PO-2024-0068",
            vendor_name="Infra Supplies Pvt Ltd",
            date="22 May, 2025",
            delivery_date="05 Jun, 2025",
            status="Issued",
            subtotal="₹ 1,69,500",
            grand_total="₹ 1,69,500"
        )
        POItem.objects.create(purchase_order=po, desc="Ergonomic chair", qty=25, price=5500, total=137500)
        POItem.objects.create(purchase_order=po, desc="Standing desks", qty=10, price=3200, total=32000)
        
        POTimelineEvent.objects.create(purchase_order=po, title="RFQ Created by Officer", time="21 May, 2025", completed=True)
        POTimelineEvent.objects.create(purchase_order=po, title="Bids Submitted by Infra Supplies", time="22 May, 2025", completed=True)
        POTimelineEvent.objects.create(purchase_order=po, title="Quotation Approved by Manager", time="22 May, 2025", completed=True)
        POTimelineEvent.objects.create(purchase_order=po, title="PO Generated and Sent", time="22 May, 2025", completed=True)
        self.stdout.write(self.style.SUCCESS("Successfully seeded purchase order."))

        # Seed default Invoice
        inv = Invoice.objects.create(
            invoice_number="INV-2024-0091",
            vendor_name="Infra Supplies Pvt Ltd",
            date="22 May, 2025",
            due_date="21 June, 2025",
            status="Pending Payment",
            subtotal="₹ 1,69,500",
            cgst="₹ 15,255",
            sgst="₹ 15,255",
            grand_total="₹ 2,00,010"
        )
        InvoiceItem.objects.create(invoice=inv, desc="Ergonomic chair", qty=25, price=5500, total=137500)
        InvoiceItem.objects.create(invoice=inv, desc="Standing desks", qty=10, price=3200, total=32000)
        
        InvoiceTimelineEvent.objects.create(invoice=inv, title="PO Issued", time="22 May, 2025", completed=True)
        InvoiceTimelineEvent.objects.create(invoice=inv, title="Invoice Generated by Vendor", time="22 May, 2025", completed=True)
        InvoiceTimelineEvent.objects.create(invoice=inv, title="Awaiting Payment Confirmation", time="Awaiting action", completed=False)
        self.stdout.write(self.style.SUCCESS("Successfully seeded invoice."))

        # Seed default ActivityLogs
        ActivityLog.objects.create(title="Vendor Onboarding", desc="Admin verified 'Techcore LTD' as an active supplier.", category="Vendors", time="4 hours ago")
        ActivityLog.objects.create(title="RFQ Created", desc="Procurement Officer created RFQ 'Office Furniture procurement Q2'.", category="RFQs", time="2 hours ago")
        ActivityLog.objects.create(title="Quotation Approved", desc="Manager Priya Shah approved Quotation #Q-99321.", category="Approvals", time="10 minutes ago")
        self.stdout.write(self.style.SUCCESS("Successfully seeded activity log events."))
        self.stdout.write(self.style.SUCCESS("All database tables seeded successfully!"))

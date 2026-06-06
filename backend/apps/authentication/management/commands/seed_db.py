from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal
from datetime import date, timedelta
from apps.vendors.models import Vendor
from apps.rfqs.models import RFQ, RFQLineItem, Quotation
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
        User = get_user_model()

        self.stdout.write("Flushing database tables...")
        ActivityLog.objects.all().delete()
        InvoiceTimelineEvent.objects.all().delete()
        InvoiceItem.objects.all().delete()
        Invoice.objects.all().delete()
        POTimelineEvent.objects.all().delete()
        POItem.objects.all().delete()
        PurchaseOrder.objects.all().delete()
        ApprovalStep.objects.all().delete()
        Approval.objects.all().delete()
        Quotation.objects.all().delete()
        RFQLineItem.objects.all().delete()
        RFQ.objects.all().delete()
        Vendor.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

        # ── Seed Users ──────────────────────────────────────────────
        users_data = [
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

        created_users = {}
        for user_data in users_data:
            username = user_data.pop('username')
            email = user_data.pop('email')
            password = 'Password123'

            if not User.objects.filter(username=username).exists() and not User.objects.filter(email=email).exists():
                role = user_data.pop('role')
                is_superuser = user_data.pop('is_superuser', False)
                is_staff = user_data.pop('is_staff', False)

                if is_superuser:
                    user = User.objects.create_superuser(
                        username=username, email=email, password=password, **user_data
                    )
                else:
                    user = User.objects.create_user(
                        username=username, email=email, password=password, role=role, **user_data
                    )
                created_users[username] = user
                self.stdout.write(self.style.SUCCESS(f"Seeded user: {username} ({role})"))
            else:
                created_users[username] = User.objects.get(username=username)
                self.stdout.write(self.style.WARNING(f"User {username} already exists, skipping..."))

        officer_user = created_users.get('officer')
        manager_user = created_users.get('manager')
        vendor_user = created_users.get('vendor')

        # ── Seed Vendors ────────────────────────────────────────────
        v1 = Vendor.objects.create(
            user=vendor_user,
            vendor_name="Acme Corporation",
            category="Heavy Machinery",
            gst_no="27AABCS1429Bz0",
            contact_no="+1-555-0198",
            status="Active",
            rating=Decimal("4.90"),
        )
        v2 = Vendor.objects.create(
            vendor_name="Global Tech Solutions",
            category="IT Infrastructure",
            gst_no="27AABCS1429Bz1",
            contact_no="+1-555-0199",
            status="Active",
            rating=Decimal("4.80"),
        )
        v3 = Vendor.objects.create(
            vendor_name="Stark Industries",
            category="Defense & Aerospace",
            gst_no="27AABCS1429Bz2",
            contact_no="+1-555-0200",
            status="Pending",
            rating=Decimal("4.95"),
        )
        v4 = Vendor.objects.create(
            vendor_name="Wayne Enterprises Logistics",
            category="Logistics",
            gst_no="27AABCS1429Bz3",
            contact_no="+1-555-0201",
            status="Blocked",
            rating=Decimal("3.20"),
        )
        self.stdout.write(self.style.SUCCESS("Seeded 4 vendors."))

        # ── Seed RFQ ────────────────────────────────────────────────
        rfq = RFQ.objects.create(
            title="Enterprise Data Center Servers Procurement",
            category="IT Infrastructure",
            deadline=date.today() + timedelta(days=10),
            description="Procurement of high-performance rack servers and networking switches for the new EU data center.",
            status="Open",
            created_by=officer_user,
        )
        rfq.assigned_vendors.add(v1, v2, v3)

        RFQLineItem.objects.create(rfq=rfq, item="Blade Server Chassis", qty=15, unit="NOS")
        RFQLineItem.objects.create(rfq=rfq, item="40G Network Switches", qty=8, unit="NOS")
        self.stdout.write(self.style.SUCCESS("Seeded RFQ with 2 line items."))

        # ── Seed Quotations ─────────────────────────────────────────
        q1 = Quotation.objects.create(
            rfq=rfq,
            vendor=v1,
            price_per_unit=Decimal("12500.00"),
            total_price=Decimal("187500.00"),
            delivery_days=14,
            vendor_notes="Includes standard 3-year warranty and onsite installation.",
            status="Selected",
        )
        q2 = Quotation.objects.create(
            rfq=rfq,
            vendor=v2,
            price_per_unit=Decimal("13200.00"),
            total_price=Decimal("198000.00"),
            delivery_days=10,
            vendor_notes="Expedited shipping included. 5-year platinum support.",
            status="Submitted",
        )
        q3 = Quotation.objects.create(
            rfq=rfq,
            vendor=v3,
            price_per_unit=Decimal("15000.00"),
            total_price=Decimal("225000.00"),
            delivery_days=30,
            vendor_notes="Military-grade hardware. Extended lead time required.",
            status="Rejected",
        )
        self.stdout.write(self.style.SUCCESS("Seeded 3 quotations."))

        # ── Seed Approval Workflow ──────────────────────────────────
        appr = Approval.objects.create(
            quotation=q1,
            status="L2 Pending",
            remarks="",
        )
        ApprovalStep.objects.create(
            approval=appr,
            approver=officer_user,
            name="Sarah Jenkins",
            role="L1 Procurement Officer",
            status="Approved",
            info="Submitted 2 hours ago",
        )
        ApprovalStep.objects.create(
            approval=appr,
            approver=manager_user,
            name="Priya Shah",
            role="L2 Approver (Procurement Manager)",
            status="Awaiting",
            info="Assigned 1 hour ago",
        )
        ApprovalStep.objects.create(
            approval=appr,
            name="David Chen",
            role="VP Operations / Final Signoff",
            status="Future",
            info="",
        )
        self.stdout.write(self.style.SUCCESS("Seeded approval workflow with 3 steps."))

        # ── Seed Purchase Order ─────────────────────────────────────
        po = PurchaseOrder.objects.create(
            po_number="PO-2026-0068",
            quotation=q1,
            vendor=v1,
            date=date.today() - timedelta(days=15),
            delivery_date=date.today() - timedelta(days=1),
            status="Issued",
            subtotal=Decimal("283500.00"),
            grand_total=Decimal("283500.00"),
        )
        POItem.objects.create(purchase_order=po, description="Blade Server Chassis", qty=15, price=Decimal("12500.00"), total=Decimal("187500.00"))
        POItem.objects.create(purchase_order=po, description="40G Network Switches", qty=8, price=Decimal("12000.00"), total=Decimal("96000.00"))

        POTimelineEvent.objects.create(purchase_order=po, title="RFQ Created by Officer", completed=True)
        POTimelineEvent.objects.create(purchase_order=po, title="Bids Submitted by Acme Corporation", completed=True)
        POTimelineEvent.objects.create(purchase_order=po, title="Quotation Approved by Manager", completed=True)
        POTimelineEvent.objects.create(purchase_order=po, title="PO Generated and Sent", completed=True)
        self.stdout.write(self.style.SUCCESS("Seeded purchase order with items and timeline."))

        # ── Seed Invoice ────────────────────────────────────────────
        inv = Invoice.objects.create(
            invoice_number="INV-2026-0091",
            purchase_order=po,
            vendor=v1,
            date=date.today() - timedelta(days=15),
            due_date=date.today() + timedelta(days=15),
            status="Pending Payment",
            subtotal=Decimal("283500.00"),
            cgst=Decimal("25515.00"),
            sgst=Decimal("25515.00"),
            grand_total=Decimal("334530.00"),
        )
        InvoiceItem.objects.create(invoice=inv, description="Blade Server Chassis", qty=15, price=Decimal("12500.00"), total=Decimal("187500.00"))
        InvoiceItem.objects.create(invoice=inv, description="40G Network Switches", qty=8, price=Decimal("12000.00"), total=Decimal("96000.00"))

        InvoiceTimelineEvent.objects.create(invoice=inv, title="PO Issued", completed=True)
        InvoiceTimelineEvent.objects.create(invoice=inv, title="Invoice Generated by Vendor", completed=True)
        InvoiceTimelineEvent.objects.create(invoice=inv, title="Awaiting Payment Confirmation", completed=False)
        self.stdout.write(self.style.SUCCESS("Seeded invoice with items and timeline."))

        # ── Seed Activity Logs ──────────────────────────────────────
        ActivityLog.objects.create(
            user=created_users.get('admin'),
            title="Vendor Onboarding",
            description="Admin verified 'Global Tech Solutions' as an active supplier.",
            category="Vendors",
        )
        ActivityLog.objects.create(
            user=officer_user,
            title="RFQ Created",
            description="Procurement Officer created RFQ 'Enterprise Data Center Servers Procurement'.",
            category="RFQs",
        )
        ActivityLog.objects.create(
            user=manager_user,
            title="Quotation Approved",
            description="Manager Priya Shah approved Quotation #Q-99321.",
            category="Approvals",
        )
        self.stdout.write(self.style.SUCCESS("Seeded 3 activity log entries."))
        self.stdout.write(self.style.SUCCESS("All database tables seeded successfully!"))

# VendorBridge – Procurement & Vendor Management ERP

**Live Demo:** https://odooxksv-round1.vercel.app/

VendorBridge is a cloud-based Procurement and Vendor Management ERP designed to streamline procurement operations through centralized vendor management, RFQ workflows, quotation evaluation, purchase order generation, invoice management, and audit tracking.

The platform helps organizations digitize procurement processes, improve transparency, and maintain complete visibility across the procurement lifecycle.

---

## Tech Stack

### Backend

* Python
* Django
* Django REST Framework
* PostgreSQL

### Frontend

* React
* Vite

### UI & Styling

* Modern CSS
* Glassmorphism Design System
* Responsive Layouts

---

## Features

### Dashboard & Analytics

* Real-time procurement insights and metrics
* Interactive and responsive dashboard
* Modern glassmorphism-based UI

### Vendor Management

* Vendor onboarding and registration
* Vendor verification workflow
* Centralized vendor database
* Vendor performance tracking

### Request for Quotation (RFQ)

* Create RFQs with multiple line items
* Manage RFQ lifecycle
* Distribute RFQs to approved vendors

### Quotation Management

* Vendor quotation submission
* Side-by-side quotation comparison
* Approval workflow for managers and administrators

### Purchase Orders & Invoicing

* Generate purchase orders from approved quotations
* Automated invoice generation
* PDF export and print support

### Audit & Activity Tracking

* Complete procurement activity logs
* Procurement lifecycle tracking
* Compliance and accountability support

---

## Basic Workflow

1. Procurement Officer creates an RFQ.
2. Vendors receive invitations and submit quotations.
3. Procurement team compares quotations.
4. Approval workflow is initiated.
5. Approved quotations generate Purchase Orders.
6. Invoice is generated from the Purchase Order.
7. Invoice can be printed or emailed directly.
8. Procurement activities are tracked through logs and analytics.

---

## Project Structure

```text
odooxksv_round1/
├── backend/
│   ├── apps/
│   │   ├── authentication/
│   │   ├── procurement/
│   │   ├── rfqs/
│   │   └── vendors/
│   ├── config/
│   ├── manage.py
│   ├── requirements.txt
│   └── build.sh
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── views/
    │   ├── App.jsx
    │   ├── config.js
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

---

## Architecture

```text
React (Vite)
      │
      ▼
Django REST Framework
      │
      ▼
 PostgreSQL
```

---

## Future Enhancements

* Email notifications and reminders
* Advanced role-based access control
* Vendor rating and scoring system
* Inventory and warehouse integration
* Multi-organization support
* Advanced procurement analytics
* Export and reporting enhancements
* Mobile-friendly procurement workflows

```
```

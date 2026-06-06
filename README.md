# VendorBridge

## 1. Project Overview & Vision
**VendorBridge** is a centralized Procurement & Vendor Management Enterprise Resource Planning (ERP) platform designed for the **Odoo Hackathon challenge**. The application digitizes the end-to-end B2B purchasing pipeline, replacing fragmented manual paper and spreadsheet workflows with a structured corporate portal. 

VendorBridge automates the following key stages of the purchasing lifecycle:
*   **Supplier Directory Management:** Enrolling, verifying, and tracking corporate vendor records.
*   **RFQ & Quotation Bidding:** Enabling Procurement Officers to draft detailed RFQs and allowing external vendors to submit bids.
*   **Quotation Comparison:** Evaluating submitted vendor quotations side-by-side on pricing, delivery speed, compliance, and vendor rating.
*   **Multi-Stage Approvals:** Running selected bids through a structured workflow chain with approval/rejection comments.
*   **Document Generation:** Auto-generating Purchase Orders and Invoices with CGST/SGST calculations, progress milestones, printable formats, and client-side PDF downloads.

---

## 2. Tech Stack & Architecture

### Backend Architecture
*   **Framework:** **Python** using the **Django (>=4.2, <5.0)** framework and **Django REST Framework (>=3.14.0)**.
*   **API Design:** Stateless RESTful APIs using DRF `APIView` components.
*   **Database Engine:** Local Relational Database: **PostgreSQL** (`django.db.backends.postgresql`).
*   **Integration Constraints:** Relies strictly on a local database instance with zero cloud-backend or third-party Backend-as-a-Service (BaaS) dependencies (No Firebase, Supabase, or MongoDB Atlas).
*   **Exact Dependencies (`backend/requirements.txt`):**
    *   `Django>=4.2,<5.0`
    *   `djangorestframework>=3.14.0`
    *   `djangorestframework-simplejwt>=5.3.0`
    *   `django-cors-headers>=4.3.0`
    *   `pillow>=10.0.0`
    *   `python-dotenv>=1.0.0`
    *   `psycopg2-binary>=2.9.0`

### Database Configuration
Database connection details are defined in `backend/config/settings.py` and map to environmental variables with default fallbacks:
*   `DB_ENGINE` / `os.getenv('DB_ENGINE', 'django.db.backends.postgresql')`
*   `DB_NAME` / `os.getenv('DB_NAME', 'vendorbridge_db')`
*   `DB_USER` / `os.getenv('DB_USER', 'vendorbridge_user')`
*   `DB_PASSWORD` / `os.getenv('DB_PASSWORD', 'vendorbridge_pass')`
*   `DB_HOST` / `os.getenv('DB_HOST', 'localhost')`
*   `DB_PORT` / `os.getenv('DB_PORT', '5432')`

### Frontend Architecture
*   **Framework:** **React (^19.2.6)** with **React-DOM (^19.2.6)**.
*   **Build Tool:** **Vite (^8.0.12)**.
*   **Styling Pattern:** Custom **Vanilla CSS** layouts (`frontend/src/index.css`) utilizing modern backdrop filters, rounded card grids, and custom hover states. No heavy third-party UI design wrappers or CSS framework dependencies are used.
*   **Icon Library:** Google Material Symbols font icons.
*   **Document Generation:** Client-side PDF compilation is handled by **html2pdf.js (^0.14.0)**.

---

## 3. Core Modules & Actual Implementations

### User Authentication
*   **Token Authentication:** Implemented via `djangorestframework-simplejwt`. The access token payload stores claims for `username`, `email`, `role`, and `name` (`backend/apps/authentication/serializers.py`).
*   **Backend Custom Auth:** Uses a custom `EmailOrUsernameModelBackend` (`backend/apps/authentication/backends.py`) allowing authentication using either corporate email or username.
*   **Navigation & Route Defense:** Available navigation tabs are filtered using the decoded role claim (`frontend/src/views/Dashboard.jsx`). If a user attempts to access an unauthorized view by modifying state, the frontend displays an **Access Denied** view. Stored tokens (`access_token` and `refresh_token`) are maintained inside `localStorage` and sent in headers as `Authorization: Bearer <token>` for API requests.

### Dashboard Analytics
*   **KPI Summary Metrics:** The landing view showcases visual metrics cards for:
    *   *Active RFQs:* Current count of open RFQs.
    *   *Pending Approvals:* Quantity of quotations awaiting manager review.
    *   *Monthly Spend:* Total cost calculated from issued Purchase Orders.
    *   *Overdue Invoices:* Number of unpaid invoices past their due dates.
*   **Component Logic:** Recent purchase orders are selected and sorted by `created_at` with select_related joins on `vendor`. Total spend is aggregated using DecimalField Sum operations (`PurchaseOrder.objects.aggregate(total=Sum('grand_total'))`). Spend trends are extracted by year and month from the DateField (`PurchaseOrder.objects.filter(date__year=year, date__month=month_num)`).

### Vendor Management
*   **Profile Records:** Manages supplier profiles tracking vendor names, category choice lists (IT, Construction, Furniture, Logistics, Raw Materials, Office Supplies, Other), GST numbers, contact numbers, status indicators, and ratings (`DecimalField`).
*   **Status Filtering:** Supports catalog navigation by Filtering categories: `All`, `Active`, `Pending`, or `Blocked`.
*   **Export Utility:** Supports compiling filtered lists into a download-ready CSV sheet (`frontend/src/views/VendorMgmt.jsx`).

### RFQ, Quotation, & Comparison
*   **RFQ Wizard Flow:** Procurement Officers draft RFQs using a multi-step configuration:
    1.  *Details:* Title, category, deadline, description.
    2.  *Items:* Item descriptions, quantities, units.
    3.  *Vendors & Attachments:* Assigning target vendors and uploading files.
*   **Vendor Bid Panel:** Assigned vendors submit pricing, expected delivery cycles, and vendor notes against active RFQs (`frontend/src/views/Quotations.jsx`).
*   **Comparison Matrix:** Evaluates quotations side-by-side. Highlights the "Lowest Price" and "Fastest" delivery dynamically based on `total_price` and `delivery_days`, while flagging warnings like "Late Delivery Risk" and "Standard" delivery (`frontend/src/views/QuotationComparison.jsx`).

### Approval Workflow
*   **State Machine Transitions:** Selected quotations enter a multi-stage approval chain: L1 Procurement Officer (Review) -> L2 Approver / Procurement Manager (Awaiting/Approved) -> VP Operations (Signoff).
*   **Actions:** Managers can approve or reject quotations by submitting remarks (`frontend/src/views/Approvals.jsx`), which updates status to `Approved` or `Rejected`, records a timezone processing timestamp, and logs a system activity log.

### Document Generation
*   **PO Module:** Generates PO documents with billing summaries, item details (description, quantity, unit price, totals), and timeline progress tracking milestones (RFQ Created -> Bids Submitted -> Quotation Approved -> PO Generated).
*   **Invoice Module:** Tracks invoices specifying subtotal, CGST (9%), SGST (9%), and grand totals. Invoices can be marked as Paid or Cancelled, updating the database record.
*   **PDF Compiler:** Client-side document downloads are generated using `html2pdf.js` by targeting DOM nodes.

---

## 4. User Roles & Access Matrix

The following table maps user roles to their permissions across the application modules:

| Role | Dashboard | RFQs | Quotations | Approvals | PO & Invoices | System Settings |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Admin** | Read-Only | No | No | No | No | Read/Write |
| **Procurement Officer** | Read/Write | Create/Publish | Read-Only | Read-Only | Read/Write (Generate/Cancel) | No |
| **Vendor** | Read-Only | Read-Only | Submit Bids | No | Read-Only (Download/Print) | No |
| **Manager** | Read-Only | Read-Only | Read-Only | Approve/Reject | Cancel Only | No |

---

## 5. Security & Form Validation Rules

### Client-Side Validation
*   **Email Verification:** Forms validate emails using the expression:
    ```javascript
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    ```
*   **GSTIN Format Check:** Verifies GST numbers format using:
    ```javascript
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
    ```
*   **Telephone Validation:** Contact inputs are validated using:
    ```javascript
    const phoneRegex = /^[+0-9\s\-()]{10,20}$/;
    ```
*   **UI Alert Prompts:** If validations fail, the system blocks requests and triggers warnings via `showAlert()` modal dialogs or alert boxes (`frontend/src/context/DialogContext.jsx`).

### Backend Serializer Validation
*   **DRF Serializers:** Incoming payloads are validated in the backend by serializers (`UserRegisterSerializer`, `RFQSerializer`, `QuotationSerializer`, `VendorSerializer`). They enforce required fields, unique constraints, and database types. Invalid requests return HTTP `400 Bad Request` with structured error messages back to the client.

### Route Protection
*   **Stateless JWT Security:** Backend API endpoints verify identity using the `JWTAuthentication` class configured in `REST_FRAMEWORK` settings.
*   **Development Access:** Endpoints use `permission_classes = [AllowAny]` to facilitate local mock testing, while route access limits are guarded in the frontend.

---

## 6. Git Team Workflow

The simulated team workflow for this codebase follows this collaborative pipeline:

```
                  ┌──────────────────────┐
                  │ Create Feature Branch│
                  │  (e.g., feature/rfq) │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Implement Code &     │
                  │ Database Migrations  │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Push to Remote Git   │
                  │  & Create Pull Req.  │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Peer Review & Schema │
                  │  Validation          │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Merge to main Branch │
                  └──────────────────────┘
```

1.  **Branching Strategy:** Developers create isolated feature branches prefixed by task type (e.g., `feature/auth-jwt-integration`, `feature/vendor-csv-export`).
2.  **Schema Review:** When altering database models, database migration scripts must be validated before pull request merging.
3.  **Code Reviews:** Prior to merging into the main branch, peer reviews check serializers, APIView routing, and input validation regex patterns.

---

## 7. Literal Folder Structure

```
odooxksv_round1/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── apps/
│       ├── authentication/
│       │   ├── backends.py
│       │   ├── models.py
│       │   ├── permissions.py
│       │   ├── serializers.py
│       │   ├── urls.py
│       │   └── views.py
│       │   └── management/
│       │       └── commands/
│       │           ├── seed_db.py
│       │           └── seed_users.py
│       ├── procurement/
│       │   ├── models.py
│       │   ├── serializers.py
│       │   └── views.py
│       ├── rfqs/
│       │   ├── models.py
│       │   ├── serializers.py
│       │   └── views.py
│       └── vendors/
│           ├── models.py
│           ├── serializers.py
│           └── views.py
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── context/
        │   └── DialogContext.jsx
        └── views/
            ├── Activity.jsx
            ├── Approvals.jsx
            ├── Dashboard.jsx
            ├── DocumentViewer.jsx
            ├── QuotationComparison.jsx
            ├── Quotations.jsx
            ├── RFQContainer.jsx
            ├── Reports.jsx
            └── VendorMgmt.jsx
```

---

## 8. Step-by-Step Local Setup & Execution

### Prerequisites
*   **Python:** v3.10 or higher
*   **Node.js:** v18 or higher
*   **npm:** v9 or higher
*   **PostgreSQL:** Local database instance running on port `5432`.

### Environment Configuration
The backend loads variables from `.env` inside `backend/`. Create a `.env` file inside `backend/` and configure the database values:
```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=vendorbridge_db
DB_USER=vendorbridge_user
DB_PASSWORD=vendorbridge_pass
DB_HOST=localhost
DB_PORT=5432
```

### Installation Steps

#### 1. Backend Setup & Dependencies
Navigate into the backend directory and install Python dependencies:
```bash
pip install -r backend/requirements.txt
```

#### 2. Database Creation & Migrations
Create the relational database `vendorbridge_db` on your local PostgreSQL server:
```sql
CREATE DATABASE vendorbridge_db;
```
Once the database is created, apply Django migrations to compile the schema structure:
```bash
python backend/manage.py migrate
```

#### 3. Seed Mock Database Records
Populate the PostgreSQL database with mock users, vendors, RFQs, POs, approvals, and activity logs:
```bash
python backend/manage.py seed_db
```
*(Alternatively, use `python backend/manage.py seed_users` to seed only default user profiles).*

#### 4. Frontend Setup
Navigate into the frontend directory and install Node dependencies:
```bash
cd frontend && npm install
```

#### 5. Launch Servers

*   **Start the Django API Server:**
    ```bash
    python backend/manage.py runserver
    ```
    *The API will listen at `http://localhost:8000`.*

*   **Start the Vite Frontend Server:**
    ```bash
    cd frontend && npm run dev
    ```
    *The React application will listen at `http://localhost:5173`.*

---



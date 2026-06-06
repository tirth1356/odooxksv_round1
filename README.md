# VendorBridge

## 1. Project Overview & Vision
**VendorBridge** is a centralized Procurement & Vendor Management Enterprise Resource Planning (ERP) platform built for the **Odoo Hackathon challenge**. The application digitizes the end-to-end B2B purchasing pipeline, replacing fragmented manual workflows with a single structured portal. 

Its core purpose is to connect procurement departments with external suppliers to handle the full procurement lifecycle:
*   **Supplier Directory Management:** Enrolling, verifying, and tracking corporate vendor records.
*   **RFQ & Quotation Bidding:** Allowing Procurement Officers to draft requests for quote (RFQs) and enabling vendors to submit bids.
*   **Quotation Comparison:** Evaluating submitted vendor quotations side-by-side on pricing, delivery speed, compliance, and vendor rating.
*   **Multi-Stage Approvals:** Running quotations through a structured workflow chain with approval/rejection remarks.
*   **Document Compilation:** Auto-generating Purchase Orders and Invoices with CGST/SGST calculations, printable formats, and client-side PDF compilation.

---

## 2. Tech Stack & Architecture

### Backend Architecture
*   **Framework:** **Python** using the **Django (>=4.2, <5.0)** framework and **Django REST Framework (>=3.14.0)**.
*   **API Pattern:** Standard stateless REST APIs.
*   **Integration Constraints:** Relies strictly on a local relational database system with zero cloud-backend or third-party Backend-as-a-Service (BaaS) dependencies (No Firebase, Supabase, or MongoDB Atlas).
*   **Exact Dependencies (`backend/requirements.txt`):**
    *   `Django>=4.2,<5.0`
    *   `djangorestframework>=3.14.0`
    *   `djangorestframework-simplejwt>=5.3.0`
    *   `django-cors-headers>=4.3.0`
    *   `pillow>=10.0.0`
    *   `python-dotenv>=1.0.0`

### Database
*   **Database Engine:** Local Relational Database: **SQLite** (`django.db.backends.sqlite3`).
*   **Target File Path:** `BASE_DIR / 'db.sqlite3'` (configured in `backend/config/settings.py`).

### Frontend Architecture
*   **Framework:** **React (^19.2.6)** with **React-DOM (^19.2.6)**.
*   **Build Tool:** **Vite (^8.0.12)**.
*   **Styling Pattern:** Custom **Vanilla CSS** layout patterns (`frontend/src/index.css`) utilizing modern backdrop filters, rounded card grids, and custom hover states. No heavy third-party UI design wrappers or CSS framework dependencies are used.
*   **Icon Library:** Google Material Symbols font icons.
*   **Document Generation:** Client-side PDF compilation is handled by **html2pdf.js (^0.14.0)**.

---

## 3. Core Functional Modules

### User Authentication & Routing Defense
*   **Token Authentication:** Implemented via `djangorestframework-simplejwt`. The access token payload stores claims for `username`, `email`, `role`, and `name` (`backend/apps/authentication/serializers.py`).
*   **Claims Handling:** The frontend decodes the access token payload on login to identify user roles (`frontend/src/App.jsx`).
*   **Navigation & Route Defense:** Available navigation tabs are filtered using the decoded role claim (`frontend/src/views/Dashboard.jsx`). If a user attempts to access an unauthorized view by modifying state, the frontend displays an **Access Denied** view.

### Dashboard / Home Screen
*   **KPI Summary Metrics:** The landing view showcases visual metrics cards for:
    *   *Active RFQs:* Current count of open RFQs.
    *   *Pending Approvals:* Quantity of quotations awaiting manager review.
    *   *Monthly Spend:* Total cost calculated from issued Purchase Orders.
    *   *Overdue Invoices:* Number of unpaid invoices past their due dates.
*   **Analytics Components:** Displays a recent purchase orders list and a categorical spend distribution donut chart summarizing logistics, IT services, and furniture expenditures (`frontend/src/views/Dashboard.jsx`).

### Vendor Directory
*   **Profile Records:** Manages supplier profiles tracking vendor names, category divisions, verified GST numbers, contact numbers, and status indicators.
*   **Status Filtering:** Supports catalog navigation by Filtering categories: `All`, `Active`, `Pending`, or `Blocked`.
*   **Export Utility:** Supports compiling filtered lists into a download-ready CSV sheet (`frontend/src/views/VendorMgmt.jsx`).

### RFQ & Bidding Pipeline
*   **Officer Form Flow:** Procurement Officers draft RFQs using a multi-step configuration:
    1.  *Details:* Title, category, deadline, description.
    2.  *Items:* Item descriptions, quantities, units.
    3.  *Vendors & Attachments:* Assigning target vendors and uploading specification files.
*   **Vendor Panel:** Assigned vendors submit unit pricing, expected delivery cycles, payment terms, and validity dates (`frontend/src/views/Quotations.jsx`).
*   **Comparison Grid:** Evaluates submitted quotations side-by-side, displaying badges for "Lowest Price", "Recommended", and "Late Delivery Risk" (`frontend/src/views/QuotationComparison.jsx`).

### Approval Workflow
*   **State Machine Transitions:** Selected quotations enter a multi-stage approval chain: L1 Procurement Officer (Review) -> L2 Approver / Procurement Manager (Awaiting/Approved) -> VP Operations (Signoff).
*   **Actions:** Managers can approve or reject quotations by submitting remarks (`frontend/src/views/Approvals.jsx`), which updates the status field to `Approved` or `Rejected` and records a system activity log.

### PO & Invoice Engine
*   **PO Module:** Generates PO documents with billing summaries, item details, and timeline progress tracking milestones (RFQ Created -> Bids Submitted -> Quotation Approved -> PO Generated).
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

*Note: Frontend view authorization rules check the role claims returned in the JWT to render these permissions.*

---

## 5. System Protections & Input Validation

### Front-End Validation
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

### Back-End Validation
*   **DRF Serializers:** Incoming payloads are validated in the backend by serializers (`UserRegisterSerializer`, `RFQSerializer`, `QuotationSerializer`, `VendorSerializer`). They enforce:
    *   Required fields.
    *   Data types (e.g., integer quantities, decimal pricing).
    *   Unique constraints (e.g., unique email and username on user registration).
*   **HTTP Status Codes:** Invalid requests return HTTP `400 Bad Request` with structured error messages detailing the failed fields.

### Route Protection
*   **Stateless JWT Security:** Backend API endpoints verify identity using:
    ```python
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
    ```
*   **Client Session Storage:** Stored tokens (`access_token` and `refresh_token`) are maintained inside `localStorage` and sent in the headers as `Authorization: Bearer <token>` for API requests.
*   **Development Access:** Endpoints use `permission_classes = [AllowAny]` to facilitate local mock testing, while route access limits are enforced client-side.

---

## 6. Git Team Workflow Simulation

Standard team guidelines for development on this codebase follow this workflow:

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
                  │ Validation           │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Merge to main Branch │
                  └──────────────────────┘
```

1.  **Branching Strategy:** Developers create isolated feature branches prefixed by task type:
    *   `feature/auth-jwt-integration`
    *   `feature/vendor-csv-export`
2.  **Schema Review:** When altering database models, database migration scripts must be validated before pull request merging.
3.  **Code Reviews:** Prior to merging into the main branch, peer reviews check serializers, APIView routing, and input validation regex patterns.

---

## 7. Folder Structure

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

## 8. Verified Local Installation Guide

### Prerequisites
*   **Python:** v3.10 or higher
*   **Node.js:** v18 or higher
*   **npm:** v9 or higher
*   **SQLite:** Included with Python standard installations

### Configuration
Connection strings, JWT keys, and debug variables are defined in the settings module (`backend/config/settings.py`). No local `.env` configuration file is required for development.

### Step-by-Step Commands

#### 1. Backend Setup & Dependencies
Navigate into the backend directory and install Python dependencies:
```bash
pip install -r backend/requirements.txt
```

#### 2. Database Migration Setup
Create the relational database structure and files:
```bash
python backend/manage.py migrate
```

#### 3. Seed Mock Database Records
Populate the SQLite database with mock users, vendors, RFQs, POs, approvals, and activity logs:
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

## License
License not specified in repository.

# VendorBridge Procurement ERP

**Deployed Link:** [VendorBridge Live on Vercel](https://odooxksv-round1.vercel.app/) 

An end-to-end cloud-based Procurement and Vendor Management System built for seamless, transparent, and efficient supply chain operations. 

## 🛠️ Technology Stack
- **Backend**: Django REST Framework (Python), PostgreSQL
- **Frontend**: React (Vite)
- **Styling**: Modern CSS (Glassmorphism & Custom Theming)

## 📂 File Hierarchy
```text
odooxksv_round1/
├── backend/                  # Django Backend Application
│   ├── apps/                 # Modular Django Apps (authentication, procurement, rfqs, vendors)
│   ├── config/               # Django Settings & WSGI
│   ├── manage.py             # Django entry point
│   ├── requirements.txt      # Python Dependencies
│   └── build.sh              # Deployment script for Render
└── frontend/                 # Vite + React Frontend Application
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── context/          # React Contexts (Dialog Context)
    │   ├── views/            # Dashboard & Feature Pages
    │   ├── App.jsx           # Main Application & Router
    │   ├── config.js         # API URL Configuration
    │   └── index.css         # Global Styles & Theme
    ├── package.json          # Node Dependencies
    └── vite.config.js        # Vite Configuration
```

## ✨ Core Features
1. **Dynamic Dashboard**
   - Real-time procurement analytics.
   - Beautiful, responsive glassmorphic UI.
2. **Vendor Management Portal**
   - Seamless onboarding and verification of vendors.
   - Comprehensive performance tracking.
3. **RFQ (Request for Quotation) Engine**
   - Create multi-item RFQs instantly.
   - Automated distribution to approved vendors.
4. **Quotation Comparison & Approval**
   - Side-by-side bid comparison.
   - Multi-tier Manager & Admin approval workflows.
5. **Purchase Order & Invoice Generation**
   - 1-click PO creation from approved bids.
   - Automated invoice generation with direct print & PDF export capabilities.
6. **Activity Auditing**
   - Complete lifecycle tracking for every procurement action to ensure 100% compliance.

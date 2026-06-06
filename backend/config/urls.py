"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from apps.procurement.views import (
    MockDashboardView,
    MockApprovalsView,
    MockPOView,
    MockInvoiceView,
    MockActivityLogsView,
    QuotationSubmitView,
)
from apps.vendors.views import MockVendorListView
from apps.rfqs.views import MockRFQView, MockQuotationComparisonView, RFQAcceptView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/dashboard/', MockDashboardView.as_view(), name='mock_dashboard'),
    path('api/vendors/', MockVendorListView.as_view(), name='mock_vendors'),
    path('api/rfqs/', MockRFQView.as_view(), name='mock_rfqs'),
    path('api/rfqs/compare/', MockQuotationComparisonView.as_view(), name='mock_rfq_compare'),
    path('api/rfqs/<int:rfq_id>/accept/', RFQAcceptView.as_view(), name='rfq_accept'),
    path('api/approvals/', MockApprovalsView.as_view(), name='mock_approvals'),
    path('api/procurement/purchase-orders/', MockPOView.as_view(), name='mock_purchase_orders'),
    path('api/procurement/invoices/', MockInvoiceView.as_view(), name='mock_invoices'),
    path('api/procurement/activity-logs/', MockActivityLogsView.as_view(), name='mock_activity_logs'),
    path('api/procurement/quotations/', QuotationSubmitView.as_view(), name='mock_quotations'),
]


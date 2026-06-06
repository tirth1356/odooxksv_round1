from django.urls import reverse
from django.core.management import call_command
from rest_framework import status
from rest_framework.test import APITestCase

class MockAPITests(APITestCase):
    def setUp(self):
        call_command('seed_db')

    def test_mock_dashboard(self):
        url = reverse('mock_dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('kpis', response.data)
        self.assertIn('recent_purchase_orders', response.data)
        self.assertIn('spending_trends', response.data)
        self.assertEqual(response.data['kpis']['active_rfqs'], 1)

    def test_mock_vendors(self):
        url = reverse('mock_vendors')
        
        # Test basic list
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

        # Test filtering by status
        response = self.client.get(url, {'status': 'active'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['status'], 'Active')

        # Test search query
        response = self.client.get(url, {'search': 'IT'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['vendor_name'], 'Global Tech Solutions')

    def test_mock_rfqs_lifecycle(self):
        url = reverse('mock_rfqs')
        
        # Test initial list
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Enterprise Data Center Servers Procurement')

        # Test creating new mock RFQ
        data = {
            "title": "IT hardware upgrade Q3",
            "category": "IT Infrastructure",
            "deadline": "2026-09-30",
            "description": "Laptops and monitors",
            "line_items": [
                {"item": "Laptop", "qty": 15, "unit": "NOS"}
            ],
            "assigned_vendors": ["Global Tech Solutions"]
        }
        
        post_response = self.client.post(url, data, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', post_response.data)
        self.assertEqual(post_response.data['rfq']['title'], 'IT hardware upgrade Q3')

        # Test listing again to see if it includes the new RFQ in-memory
        list_response = self.client.get(url)
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data), 2)
        self.assertEqual(list_response.data[1]['title'], 'IT hardware upgrade Q3')

    def test_mock_rfq_compare(self):
        url = reverse('mock_rfq_compare')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        self.assertEqual(response.data[0]['name'], 'Acme Corporation')
        self.assertEqual(response.data[0]['badge'], 'Lowest Price')

    def test_mock_approvals(self):
        url = reverse('mock_approvals')
        
        # Test GET
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'L2 Pending')
        self.assertEqual(response.data['rfq_title'], 'Enterprise Data Center Servers Procurement')
        
        # Test POST approve
        response = self.client.post(url, {'action': 'approve', 'remarks': 'Approved by manager Priya'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['status'], 'Approved')
        self.assertEqual(response.data['data']['remarks'], 'Approved by manager Priya')
        
        # Test POST reject
        response = self.client.post(url, {'action': 'reject', 'remarks': 'Rejected because too costly'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['status'], 'Rejected')
        self.assertEqual(response.data['data']['remarks'], 'Rejected because too costly')

    def test_mock_purchase_orders(self):
        url = reverse('mock_purchase_orders')
        
        # Test GET
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['po_number'], 'PO-2026-0068')
        
        # Test POST cancel
        response = self.client.post(url, {'action': 'cancel'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'Cancelled')

    def test_mock_invoices(self):
        url = reverse('mock_invoices')
        
        # Test GET
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['invoice_number'], 'INV-2026-0091')
        
        # Test POST pay
        response = self.client.post(url, {'action': 'pay'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'Paid')
        
        # Test POST cancel
        response = self.client.post(url, {'action': 'cancel'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'Cancelled')

    def test_mock_activity_logs(self):
        url = reverse('mock_activity_logs')
        
        # Test GET
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)
        self.assertEqual(response.data[0]['category'], 'Approvals')

    def test_quotation_submission(self):
        url = reverse('mock_quotations')
        
        # Test GET
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
        
        # Test POST
        payload = {
            "rfq_id": "99321",
            "tax_rate": 18.0,
            "validity": "30 Days",
            "payment_terms": "Net 20",
            "subtotal": 169500.0,
            "gst_amount": 30510.0,
            "grand_total": 200010.0,
            "status": "Submitted",
            "line_items": [
                {"desc": "Ergonomic chair", "qty": 25, "unit_price": 5500.0, "delivery_days": 10},
                {"desc": "Standing desks", "qty": 10, "unit_price": 3200.0, "delivery_days": 10}
            ]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'Submitted')
        self.assertEqual(len(response.data['line_items']), 2)


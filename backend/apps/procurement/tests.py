from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

class MockAPITests(APITestCase):
    def test_mock_dashboard(self):
        url = reverse('mock_dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('kpis', response.data)
        self.assertIn('recent_purchase_orders', response.data)
        self.assertIn('spending_trends', response.data)
        self.assertEqual(response.data['kpis']['active_rfqs'], 12)

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
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['vendor_name'], 'Techcore LTD')

    def test_mock_rfqs_lifecycle(self):
        url = reverse('mock_rfqs')
        
        # Test initial list
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Office Furniture procurement Q2')

        # Test creating new mock RFQ
        data = {
            "title": "IT hardware upgrade Q3",
            "category": "IT",
            "deadline": "2026-09-30",
            "description": "Laptops and monitors",
            "line_items": [
                {"item": "Laptop", "qty": 15, "unit": "NOS"}
            ],
            "assigned_vendors": ["Techcore LTD"]
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

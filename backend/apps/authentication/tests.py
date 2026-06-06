from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()

class AuthenticationTests(APITestCase):
    def setUp(self):
        # Create a test user directly
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User',
            role='Vendor',
            phone_number='1234567890',
            country='India'
        )
        self.login_url = reverse('auth_login')
        self.register_url = reverse('auth_register')

    def test_user_registration(self):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword123',
            'first_name': 'New',
            'last_name': 'Officer',
            'role': 'Procurement Officer',
            'phone_number': '9876543210',
            'country': 'USA',
            'additional_information': 'Test registration'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['username'], 'newuser')
        self.assertEqual(response.data['user']['role'], 'Procurement Officer')
        
        # Verify saved in db
        user = User.objects.get(username='newuser')
        self.assertEqual(user.email, 'newuser@example.com')
        self.assertEqual(user.country, 'USA')

    def test_login_with_username(self):
        data = {
            'username': 'testuser',
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_with_email(self):
        data = {
            'username': 'test@example.com', # Should map to the user.email
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid_credentials(self):
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Seeds default users for the hackathon role demo'

    def handle(self, *args, **options):
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
            
            # Check if user already exists
            if not User.objects.filter(username=username).exists() and not User.objects.filter(email=email).exists():
                role = user_data.pop('role')
                # For admin/superuser creation helper
                is_superuser = user_data.pop('is_superuser', False)
                is_staff = user_data.pop('is_staff', False)
                
                if is_superuser:
                    user = User.objects.create_superuser(
                        username=username,
                        email=email,
                        password=password,
                        **user_data
                    )
                else:
                    user = User.objects.create_user(
                        username=username,
                        email=email,
                        password=password,
                        role=role,
                        **user_data
                    )
                self.stdout.write(self.style.SUCCESS(f"Successfully seeded user: {username} ({role})"))
            else:
                self.stdout.write(self.style.WARNING(f"User {username} already exists, skipping..."))

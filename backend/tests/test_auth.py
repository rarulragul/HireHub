import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
def test_user_registration_success(api_client):
    url = reverse('auth-register')
    payload = {
        'full_name': 'Test Candidate',
        'email': 'new_candidate@test.com',
        'role': 'CANDIDATE',
        'password': 'SecurePassword123!',
        'confirm_password': 'SecurePassword123!'
    }
    response = api_client.post(url, payload)
    assert response.status_code == status.HTTP_201_CREATED
    assert 'access' in response.data
    assert response.data['user']['email'] == 'new_candidate@test.com'
    
    # Verify password hashing
    user = User.objects.get(email='new_candidate@test.com')
    assert user.password != 'SecurePassword123!'
    assert user.check_password('SecurePassword123!') is True


@pytest.mark.django_db
def test_admin_registration_prevented(api_client):
    url = reverse('auth-register')
    payload = {
        'full_name': 'Hacker',
        'email': 'hacker@test.com',
        'role': 'ADMIN',
        'password': 'Password123!',
        'confirm_password': 'Password123!'
    }
    response = api_client.post(url, payload)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_login_success_and_invalid_credentials(api_client):
    User.objects.create_user(
        email='login_user@test.com',
        full_name='Login Tester',
        password='ValidPassword123!',
        role='CANDIDATE'
    )

    url = reverse('auth-login')

    # Test invalid credentials
    bad_res = api_client.post(url, {'email': 'login_user@test.com', 'password': 'WrongPassword'})
    assert bad_res.status_code == status.HTTP_400_BAD_REQUEST

    # Test valid credentials
    good_res = api_client.post(url, {'email': 'login_user@test.com', 'password': 'ValidPassword123!'})
    assert good_res.status_code == status.HTTP_200_OK
    assert 'access' in good_res.data
    assert 'refresh' in good_res.data
    assert good_res.data['user']['email'] == 'login_user@test.com'


@pytest.mark.django_db
def test_jwt_token_refresh(api_client):
    User.objects.create_user(
        email='jwt_user@test.com',
        full_name='JWT User',
        password='Password123!',
        role='CANDIDATE'
    )
    login_res = api_client.post(reverse('auth-login'), {'email': 'jwt_user@test.com', 'password': 'Password123!'})
    refresh_token = login_res.data['refresh']

    refresh_url = reverse('token-refresh')
    refresh_res = api_client.post(refresh_url, {'refresh': refresh_token})
    assert refresh_res.status_code == status.HTTP_200_OK
    assert 'access' in refresh_res.data

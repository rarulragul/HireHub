import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from recruiters.models import RecruiterProfile
from jobs.models import Job

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def recruiter_user():
    user = User.objects.create_user(email='rec@test.com', full_name='Recruiter Test', password='Password123!', role='RECRUITER')
    RecruiterProfile.objects.create(user=user, company_name='Acme Corp')
    return user

@pytest.fixture
def candidate_user():
    return User.objects.create_user(email='cand@test.com', full_name='Cand Test', password='Password123!', role='CANDIDATE')

@pytest.mark.django_db
def test_job_creation_permissions(api_client, recruiter_user, candidate_user):
    url = reverse('job-list-create')
    job_data = {
        'title': 'Python Backend Engineer',
        'description': 'Building high volume APIs',
        'required_skills': 'Python, Django',
        'department': 'Engineering',
        'location': 'Remote',
        'employment_type': 'FULL_TIME',
        'experience_required': 2.0,
        'salary_min': 80000,
        'salary_max': 120000,
        'status': 'OPEN'
    }

    # Anonymous user cannot create job
    res = api_client.post(url, job_data)
    assert res.status_code == status.HTTP_401_UNAUTHORIZED

    # Candidate user cannot create job
    api_client.force_authenticate(user=candidate_user)
    res = api_client.post(url, job_data)
    assert res.status_code == status.HTTP_403_FORBIDDEN

    # Recruiter user can create job
    api_client.force_authenticate(user=recruiter_user)
    res = api_client.post(url, job_data)
    assert res.status_code == status.HTTP_201_CREATED
    assert Job.objects.filter(title='Python Backend Engineer').exists()


@pytest.mark.django_db
def test_job_search_and_filtering(api_client, recruiter_user):
    profile = recruiter_user.recruiter_profile
    Job.objects.create(
        title='React Frontend Specialist',
        description='UI work',
        required_skills='React',
        department='Design',
        location='New York',
        status='OPEN',
        recruiter=profile
    )
    Job.objects.create(
        title='DevOps Cloud Engineer',
        description='Infra work',
        required_skills='Docker, AWS',
        department='Infrastructure',
        location='San Francisco',
        status='OPEN',
        recruiter=profile
    )

    url = reverse('job-list-create')

    # Filter by search
    res = api_client.get(url, {'search': 'React'})
    assert res.status_code == status.HTTP_200_OK
    assert res.data['count'] == 1
    assert res.data['results'][0]['title'] == 'React Frontend Specialist'

    # Filter by location
    res_loc = api_client.get(url, {'location': 'San Francisco'})
    assert res_loc.status_code == status.HTTP_200_OK
    assert res_loc.data['count'] == 1
    assert res_loc.data['results'][0]['title'] == 'DevOps Cloud Engineer'

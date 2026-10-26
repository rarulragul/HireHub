import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
from accounts.models import User
from recruiters.models import RecruiterProfile
from candidates.models import CandidateProfile
from jobs.models import Job
from applications.models import JobApplication

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def setup_job_and_users():
    rec_user = User.objects.create_user(email='rec1@test.com', full_name='Rec 1', password='Password123!', role='RECRUITER')
    rec_prof = RecruiterProfile.objects.create(user=rec_user, company_name='Tech Inc')
    
    cand_user = User.objects.create_user(email='cand1@test.com', full_name='Cand 1', password='Password123!', role='CANDIDATE')
    fake_pdf = SimpleUploadedFile("resume.pdf", b"%PDF-1.4 sample pdf content", content_type="application/pdf")
    cand_prof = CandidateProfile.objects.create(user=cand_user, resume_path=fake_pdf)

    job = Job.objects.create(
        title='Django Developer',
        description='Desc',
        required_skills='Python',
        department='Eng',
        location='Remote',
        status='OPEN',
        recruiter=rec_prof
    )

    return rec_user, cand_user, job, cand_prof

@pytest.mark.django_db
def test_apply_and_prevent_duplicate_application(api_client, setup_job_and_users):
    rec_user, cand_user, job, cand_prof = setup_job_and_users
    api_client.force_authenticate(user=cand_user)

    url = reverse('job-apply', kwargs={'job_id': job.id})
    res = api_client.post(url, {'cover_letter': 'Excited to apply!'})
    assert res.status_code == status.HTTP_201_CREATED
    assert JobApplication.objects.filter(job=job, candidate=cand_prof).count() == 1

    # Attempt duplicate application
    dup_res = api_client.post(url, {'cover_letter': 'Applying again!'})
    assert dup_res.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_application_status_update_by_recruiter(api_client, setup_job_and_users):
    rec_user, cand_user, job, cand_prof = setup_job_and_users
    app = JobApplication.objects.create(job=job, candidate=cand_prof, cover_letter='Hello')

    url = reverse('application-status-update', kwargs={'pk': app.id})

    # Candidate cannot update status
    api_client.force_authenticate(user=cand_user)
    cand_res = api_client.patch(url, {'status': 'SHORTLISTED'})
    assert cand_res.status_code == status.HTTP_403_FORBIDDEN

    # Recruiter can update status
    api_client.force_authenticate(user=rec_user)
    rec_res = api_client.patch(url, {'status': 'SHORTLISTED'})
    assert rec_res.status_code == status.HTTP_200_OK
    app.refresh_from_db()
    assert app.status == 'SHORTLISTED'


@pytest.mark.django_db
def test_application_withdrawal_by_candidate(api_client, setup_job_and_users):
    rec_user, cand_user, job, cand_prof = setup_job_and_users
    app = JobApplication.objects.create(job=job, candidate=cand_prof, cover_letter='Hello')

    url = reverse('application-withdraw', kwargs={'pk': app.id})

    api_client.force_authenticate(user=cand_user)
    res = api_client.patch(url)
    assert res.status_code == status.HTTP_200_OK
    app.refresh_from_db()
    assert app.status == 'WITHDRAWN'

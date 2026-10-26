from django.core.management.base import BaseCommand
from accounts.models import User
from candidates.models import CandidateProfile
from recruiters.models import RecruiterProfile
from jobs.models import Job
from applications.models import JobApplication

class Command(BaseCommand):
    help = 'Seeds initial administrative accounts, recruiters, candidates, jobs, and sample applications'

    def handle(self, *args, **options):
        self.stdout.write("Seeding HireHub database...")

        # 1. Admin
        admin, created = User.objects.get_or_create(
            email='admin@hirehub.com',
            defaults={
                'full_name': 'Chief System Admin',
                'role': 'ADMIN',
                'is_staff': True,
                'is_superuser': True,
                'is_active': True
            }
        )
        if created:
            admin.set_password('AdminPassword123!')
            admin.save()
            self.stdout.write(self.style.SUCCESS("Created Admin: admin@hirehub.com / AdminPassword123!"))

        # 2. Recruiter 1 (Google)
        rec1, created = User.objects.get_or_create(
            email='recruiter@google.com',
            defaults={'full_name': 'Elena Rostova', 'role': 'RECRUITER', 'is_active': True}
        )
        if created:
            rec1.set_password('RecruiterPassword123!')
            rec1.save()
        rec_prof1, _ = RecruiterProfile.objects.get_or_create(
            user=rec1,
            defaults={
                'company_name': 'Google Cloud Systems',
                'company_description': 'Leading global technology company organizing world information.',
                'company_website': 'https://cloud.google.com'
            }
        )

        # 3. Recruiter 2 (Microsoft)
        rec2, created = User.objects.get_or_create(
            email='hr@microsoft.com',
            defaults={'full_name': 'Marcus Vance', 'role': 'RECRUITER', 'is_active': True}
        )
        if created:
            rec2.set_password('RecruiterPassword123!')
            rec2.save()
        rec_prof2, _ = RecruiterProfile.objects.get_or_create(
            user=rec2,
            defaults={
                'company_name': 'Microsoft Solutions',
                'company_description': 'Empowering every person and organization on the planet to achieve more.',
                'company_website': 'https://microsoft.com'
            }
        )

        # 4. Candidate 1 (Alex Dev)
        cand1, created = User.objects.get_or_create(
            email='alex.dev@gmail.com',
            defaults={'full_name': 'Alex Rivera', 'role': 'CANDIDATE', 'is_active': True}
        )
        if created:
            cand1.set_password('CandidatePassword123!')
            cand1.save()
        cand_prof1, _ = CandidateProfile.objects.get_or_create(
            user=cand1,
            defaults={
                'phone': '+1 (555) 234-5678',
                'location': 'San Francisco, CA (Remote)',
                'education': 'B.S. in Computer Science, Stanford University',
                'experience_years': 3.5,
                'skills': 'Python, Django, React, REST APIs, MySQL, Docker, TailwindCSS'
            }
        )

        # 5. Candidate 2 (Sarah Data)
        cand2, created = User.objects.get_or_create(
            email='sarah.data@gmail.com',
            defaults={'full_name': 'Sarah Jenkins', 'role': 'CANDIDATE', 'is_active': True}
        )
        if created:
            cand2.set_password('CandidatePassword123!')
            cand2.save()
        cand_prof2, _ = CandidateProfile.objects.get_or_create(
            user=cand2,
            defaults={
                'phone': '+1 (555) 876-5432',
                'location': 'New York, NY',
                'education': 'M.S. in Data Science, Columbia University',
                'experience_years': 4.0,
                'skills': 'Python, PyTorch, SQL, Pandas, FastApi, Machine Learning, Data Visualization'
            }
        )

        # 6. Jobs
        job1, _ = Job.objects.get_or_create(
            title='Senior Full Stack Python Engineer',
            recruiter=rec_prof1,
            defaults={
                'description': 'We are looking for a skilled Senior Python Full Stack Engineer proficient with Django, React, REST APIs, and relational databases to lead our cloud application dashboard development.',
                'required_skills': 'Python, Django, React, TypeScript, MySQL, Docker, Redis',
                'department': 'Software Engineering',
                'location': 'Mountain View, CA / Remote',
                'employment_type': 'FULL_TIME',
                'experience_required': 4.0,
                'salary_min': 130000,
                'salary_max': 175000,
                'status': 'OPEN'
            }
        )

        job2, _ = Job.objects.get_or_create(
            title='Backend Django & Cloud Developer',
            recruiter=rec_prof1,
            defaults={
                'description': 'Develop scalable backend microservices, high-throughput REST APIs, and database migrations for high-traffic enterprise recruitment platforms.',
                'required_skills': 'Python, Django REST Framework, PostgreSQL, MySQL, AWS',
                'department': 'Backend Engineering',
                'location': 'Seattle, WA (Hybrid)',
                'employment_type': 'FULL_TIME',
                'experience_required': 2.5,
                'salary_min': 105000,
                'salary_max': 140000,
                'status': 'OPEN'
            }
        )

        job3, _ = Job.objects.get_or_create(
            title='Frontend React & UI/UX Specialist',
            recruiter=rec_prof2,
            defaults={
                'description': 'Build captivating, fluid user experiences using React, Vite, modern CSS systems, and data analytics dashboards with Recharts.',
                'required_skills': 'React, JavaScript, HTML5, CSS3, Vite, REST APIs, Figma',
                'department': 'Frontend Engineering',
                'location': 'Remote / Nationwide',
                'employment_type': 'REMOTE',
                'experience_required': 2.0,
                'salary_min': 95000,
                'salary_max': 130000,
                'status': 'OPEN'
            }
        )

        job4, _ = Job.objects.get_or_create(
            title='AI & Machine Learning Data Engineer',
            recruiter=rec_prof2,
            defaults={
                'description': 'Build and deploy machine learning models, predictive algorithms, and semantic resume search features.',
                'required_skills': 'Python, SQL, PyTorch, Scikit-Learn, Pandas, REST APIs',
                'department': 'Artificial Intelligence',
                'location': 'Redmond, WA',
                'employment_type': 'FULL_TIME',
                'experience_required': 3.0,
                'salary_min': 125000,
                'salary_max': 165000,
                'status': 'OPEN'
            }
        )

        # 7. Job Applications
        app1, _ = JobApplication.objects.get_or_create(
            job=job1,
            candidate=cand_prof1,
            defaults={
                'cover_letter': 'I have built multiple production Django & React platforms with clean architecture and automated test pipelines. Excited to contribute!',
                'status': 'SHORTLISTED'
            }
        )

        app2, _ = JobApplication.objects.get_or_create(
            job=job3,
            candidate=cand_prof1,
            defaults={
                'cover_letter': 'My passion is building accessible, high-performance web applications with stunning visual aesthetics.',
                'status': 'APPLIED'
            }
        )

        app3, _ = JobApplication.objects.get_or_create(
            job=job4,
            candidate=cand_prof2,
            defaults={
                'cover_letter': 'With 4 years of experience delivering machine learning pipelines in production, I am enthusiastic about joining your AI division.',
                'status': 'INTERVIEW'
            }
        )

        self.stdout.write(self.style.SUCCESS("HireHub database seeded successfully with test users, jobs, and applications!"))

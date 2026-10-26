<<<<<<< HEAD
# HireHub – Python Full Stack Recruitment and Employee Management Portal

[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.1-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Tests](https://img.shields.io/badge/Tests-9%20Passed-brightgreen.svg)]()

**HireHub** is an enterprise-grade recruitment and talent acquisition platform designed for colleges, tech enterprises, and job seekers. It features a complete **Django REST Framework** backend, secure **JWT authentication**, **MySQL 8** database integration with automatic SQLite development fallback, and a modern, responsive **React + Vite** frontend.

---

## 🌟 Key Features

### 1. 🛡️ Role-Based Access Control (RBAC)
- **Candidate**: Search open jobs with instant multi-criteria filters, upload verified PDF resumes, submit applications with cover notes, track pipeline stages in real time, and withdraw applications.
- **HR Recruiter**: Post, update, close, and manage job listings, review applicants, download resumes with authorization checks, and update candidate statuses through recruitment workflows (`UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`).
- **Administrator**: Comprehensive dashboard metrics, user management (activate/deactivate accounts), system audit controls, and real-time recruitment trend analytics.

### 2. 🔐 Security & Architecture
- **JWT Authentication**: SimpleJWT access (60 min) and refresh tokens (7 days) with token blacklisting on logout.
- **Secure File Storage**: PDF resume validation (header magic bytes check, file extension check, 5MB size limit) with authorization-protected download endpoints.
- **Duplicate Prevention**: Database-level unique constraint on `(job_id, candidate_id)`.
- **CORS Configured**: Seamless integration between React frontend and Django backend.

---

## 📁 Project Architecture

```
HireHub/
├── backend/
│   ├── config/             # Django root configuration (settings, urls, wsgi)
│   ├── accounts/           # Custom User model, JWT views, serializers
│   ├── candidates/         # CandidateProfile and secure resume endpoints
│   ├── recruiters/         # RecruiterProfile and company endpoints
│   ├── jobs/               # Job model, filtering, search, and CRUD views
│   ├── applications/       # Application workflow and status transitions
│   ├── dashboard/          # Analytics and aggregation endpoints
│   ├── common/             # Permissions, pagination, exception handlers, validators
│   ├── tests/              # Automated pytest-django test suite
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/            # Centralized Axios client with JWT interceptor
│   │   ├── components/     # Navbar, Sidebar, Footer, Cards, Modal, Spinners
│   │   ├── context/        # AuthContext with persistent session
│   │   ├── pages/          # 18 fully implemented application pages
│   │   ├── styles/         # CSS design system (Blue & White palette)
│   │   ├── App.jsx         # React Router and protected routes
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
├── database/
│   ├── schema_documentation.sql  # Normalized MySQL 8 DDL schema
│   └── sample-data-guide.md      # Sample credentials and test scenarios
├── docs/
│   ├── API_DOCUMENTATION.md      # Detailed REST API specification
│   └── SETUP_GUIDE.md            # Step-by-step setup walkthrough
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Start
```powershell
# In terminal 1
cd backend
.\venv\Scripts\activate
python manage.py migrate
python manage.py seed_data
python manage.py runserver 8000
```
Backend runs at: `http://127.0.0.1:8000/api`

### 2. Frontend Start
```powershell
# In terminal 2
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173/`

---

## 🧪 Test Suite Execution

All 9 automated backend tests have been verified:
```powershell
.\backend\venv\Scripts\pytest.exe backend\tests
```
Result: `9 passed in 15.35s` (100% pass rate).

---

## 👥 Demo Logins

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@hirehub.com` | `AdminPassword123!` |
| **Recruiter (Google)** | `recruiter@google.com` | `RecruiterPassword123!` |
| **Candidate** | `alex.dev@gmail.com` | `CandidatePassword123!` |
=======
# HireHub
>>>>>>> eef9a964ff18676c5119443afdf669f7f5a19f61

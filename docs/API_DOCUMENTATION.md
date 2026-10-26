# HireHub REST API Documentation

This document specifies the REST API endpoints provided by the Django REST Framework backend.

**Base URL:** `http://127.0.0.1:8000/api`

All protected endpoints require the following HTTP header:
```http
Authorization: Bearer <your_jwt_access_token>
```

---

## 1. Authentication & Account Endpoints

### 1.1 Register New User
- **Endpoint:** `POST /api/auth/register/`
- **Access:** Public (AllowAny)
- **Rules:** Cannot register as `ADMIN`. Allowed roles: `CANDIDATE`, `RECRUITER`.
- **Request Body:**
  ```json
  {
    "full_name": "Sarah Connor",
    "email": "sarah@example.com",
    "role": "CANDIDATE",
    "password": "Password123!",
    "confirm_password": "Password123!"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Registration successful.",
    "user": {
      "id": 1,
      "email": "sarah@example.com",
      "full_name": "Sarah Connor",
      "role": "CANDIDATE",
      "is_active": true,
      "date_joined": "2026-10-26T06:00:00Z"
    },
    "access": "<jwt_access_token>",
    "refresh": "<jwt_refresh_token>"
  }
  ```

### 1.2 User Login
- **Endpoint:** `POST /api/auth/login/`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "sarah@example.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "user": { "id": 1, "email": "sarah@example.com", "full_name": "Sarah Connor", "role": "CANDIDATE" },
    "access": "<jwt_access_token>",
    "refresh": "<jwt_refresh_token>"
  }
  ```

### 1.3 Refresh JWT Token
- **Endpoint:** `POST /api/auth/token/refresh/`
- **Request Body:**
  ```json
  { "refresh": "<jwt_refresh_token>" }
  ```
- **Response (200 OK):**
  ```json
  { "access": "<new_jwt_access_token>" }
  ```

### 1.4 Get Current User Profile
- **Endpoint:** `GET /api/auth/me/`
- **Access:** Authenticated

### 1.5 Logout & Blacklist Token
- **Endpoint:** `POST /api/auth/logout/`
- **Request Body:**
  ```json
  { "refresh": "<jwt_refresh_token>" }
  ```

---

## 2. Candidate Endpoints

### 2.1 Get / Update Profile
- **Endpoints:**
  - `GET /api/candidates/me/`
  - `PUT /api/candidates/me/`
- **Request Body (PUT):**
  ```json
  {
    "phone": "+1 555-0199",
    "location": "San Francisco, CA",
    "education": "B.S. in Computer Science",
    "experience_years": 3.5,
    "skills": "Python, Django, React, MySQL"
  }
  ```

### 2.2 Upload PDF Resume
- **Endpoint:** `POST /api/candidates/me/resume/`
- **Content-Type:** `multipart/form-data`
- **Field:** `resume` (PDF file, max 5MB)

### 2.3 Download Resume (Secure)
- **Endpoint:** `GET /api/candidates/resume/` (Self) or `GET /api/candidates/{id}/resume/` (Authorized recruiter/admin)

---

## 3. Recruiter Endpoints

### 3.1 Get / Update Recruiter Company Profile
- **Endpoints:**
  - `GET /api/recruiters/me/`
  - `PUT /api/recruiters/me/`

---

## 4. Jobs Endpoints

### 4.1 Browse Jobs (Search & Filter)
- **Endpoint:** `GET /api/jobs/`
- **Access:** Public (candidates see OPEN jobs only)
- **Query Parameters:**
  - `search`: Keyword for title, skills, description, company
  - `department`: Filter by department
  - `location`: Filter by location
  - `employment_type`: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `REMOTE`
  - `page`: Page number (default: 1)
  - `page_size`: Results per page (default: 10)

### 4.2 Create Job
- **Endpoint:** `POST /api/jobs/`
- **Access:** Recruiter or Admin

### 4.3 Get Job Details
- **Endpoint:** `GET /api/jobs/{id}/`

### 4.4 Update / Delete Job
- **Endpoints:**
  - `PUT /api/jobs/{id}/`
  - `DELETE /api/jobs/{id}/`
- **Access:** Job owner Recruiter or Admin

---

## 5. Applications Endpoints

### 5.1 Apply to a Job
- **Endpoint:** `POST /api/jobs/{job_id}/applications/`
- **Access:** Candidate only
- **Payload:** `cover_letter` (text), optional `resume_path` (file)
- **Validation:** Prevents duplicate applications with database unique constraint.

### 5.2 Candidate My Applications
- **Endpoint:** `GET /api/applications/my/`

### 5.3 Recruiter View Job Applicants
- **Endpoint:** `GET /api/jobs/{job_id}/applicants/`

### 5.4 Update Application Status
- **Endpoint:** `PATCH /api/applications/{id}/status/`
- **Allowed Statuses:** `APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`

### 5.5 Withdraw Application
- **Endpoint:** `PATCH /api/applications/{id}/withdraw/`
- **Access:** Application owner Candidate

### 5.6 Download Application Resume
- **Endpoint:** `GET /api/applications/{id}/resume/`

---

## 6. Dashboard & Analytics Endpoints

- `GET /api/dashboard/candidate/` – Candidate personal funnel metrics
- `GET /api/dashboard/recruiter/` – Recruiter job applicant analytics
- `GET /api/admin/dashboard/` – Global system statistics
- `GET /api/admin/analytics/` – Recruitment monthly trends & pipeline distribution

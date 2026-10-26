# HireHub Database & Sample Data Guide

This guide details the seeded users, pre-configured roles, credentials, and test workflows.

---

## 1. Pre-configured Credentials

| Role | Name | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Chief System Admin | `admin@hirehub.com` | `AdminPassword123!` | System dashboard, user management, global oversight |
| **Recruiter** | Elena Rostova | `recruiter@google.com` | `RecruiterPassword123!` | Google Cloud Systems, manages job postings & applicants |
| **Recruiter** | Marcus Vance | `hr@microsoft.com` | `RecruiterPassword123!` | Microsoft Solutions, evaluates software engineering candidates |
| **Candidate** | Alex Rivera | `alex.dev@gmail.com` | `CandidatePassword123!` | Full Stack Python/React Developer (applied & shortlisted) |
| **Candidate** | Sarah Jenkins | `sarah.data@gmail.com` | `CandidatePassword123!` | Data Scientist / ML Specialist (applied & interview stage) |

---

## 2. Running MySQL 8 Database

1. Ensure MySQL 8 service is started.
2. In `backend/.env`, set your MySQL root password:
   ```env
   DB_NAME=hirehub_db
   DB_USER=root
   DB_PASSWORD=your_actual_mysql_password
   DB_HOST=127.0.0.1
   DB_PORT=3306
   ```
3. Run migrations and seed data:
   ```bash
   python backend/manage.py migrate
   python backend/manage.py seed_data
   ```

*Note:* If MySQL credentials are not yet set in `.env`, HireHub automatically utilizes SQLite without crashing, allowing immediate testing.

---

## 3. Pre-Seeded Sample Jobs

1. **Senior Full Stack Python Engineer** - Google Cloud Systems (Mountain View / Remote)
2. **Backend Django & Cloud Developer** - Google Cloud Systems (Seattle / Hybrid)
3. **Frontend React & UI/UX Specialist** - Microsoft Solutions (Remote)
4. **AI & Machine Learning Data Engineer** - Microsoft Solutions (Redmond)

# HireHub Full Stack Setup & Local Running Guide

This guide walks you through setting up and running **HireHub** locally on your machine.

---

## Prerequisites

1. **Python 3.12+** (Verified with Python 3.13)
2. **Node.js 18+** & **npm** (Verified with Node 24 & npm 11)
3. **MySQL 8** (or SQLite fallback)

---

## 1. Backend Setup

Open a terminal in the project root:

```powershell
# Navigate to backend or root
cd c:\Users\ragul\OneDrive\Desktop\HireHub

# Activate virtual environment
.\backend\venv\Scripts\Activate.ps1

# (Optional if not yet installed)
pip install -r backend\requirements.txt
```

### Database Configuration (MySQL 8)
Open `backend/.env` and update the database settings if you wish to connect directly to your local MySQL 8 server:

```env
DB_NAME=hirehub_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

*Note:* If MySQL credentials are not set or the server is unavailable, the backend automatically uses `db.sqlite3` with full functionality!

### Execute Migrations & Populate Initial Data
```powershell
python backend\manage.py migrate
python backend\manage.py seed_data
```

### Start Django Backend Dev Server
```powershell
python backend\manage.py runserver 8000
```
The backend API is now running at: `http://127.0.0.1:8000/api/`

---

## 2. Frontend Setup

Open a second terminal window:

```powershell
cd c:\Users\ragul\OneDrive\Desktop\HireHub\frontend

# Install dependencies (already installed)
npm install

# Start Vite React development server
npm run dev
```

The frontend application will start at: `http://localhost:5173/`

---

## 3. Pre-Seeded Demonstration Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@hirehub.com` | `AdminPassword123!` |
| **Recruiter (Google)** | `recruiter@google.com` | `RecruiterPassword123!` |
| **Recruiter (Microsoft)** | `hr@microsoft.com` | `RecruiterPassword123!` |
| **Candidate** | `alex.dev@gmail.com` | `CandidatePassword123!` |
| **Candidate (Data Science)** | `sarah.data@gmail.com` | `CandidatePassword123!` |

*(You can also use the 1-click Quick Autofill buttons on the login screen for rapid demo evaluation).*

---

## 4. Running Backend Tests

To run the automated test suite with pytest:

```powershell
.\backend\venv\Scripts\pytest.exe backend\tests
```
All 9 test suites will run and verify authentication, password hashing, role permissions, job filtering, and duplicate application prevention.

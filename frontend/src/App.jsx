import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobListingPage from './pages/JobListingPage';
import JobDetailPage from './pages/JobDetailPage';
import CandidateDashboardPage from './pages/CandidateDashboardPage';
import CandidateProfilePage from './pages/CandidateProfilePage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import RecruiterJobsPage from './pages/RecruiterJobsPage';
import JobCreateEditPage from './pages/JobCreateEditPage';
import ApplicantsManagementPage from './pages/ApplicantsManagementPage';
import ApplicationReviewPage from './pages/ApplicationReviewPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import RecruitmentAnalyticsPage from './pages/RecruitmentAnalyticsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}

function MainApp() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/candidate') || 
                           location.pathname.startsWith('/recruiter') || 
                           location.pathname.startsWith('/admin') ||
                           location.pathname.includes('/edit');

  return (
    <div className="app-layout">
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobListingPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Candidate Routes */}
          <Route path="/candidate/dashboard" element={
            <ProtectedRoute allowedRoles={['CANDIDATE']}>
              <DashboardLayout><CandidateDashboardPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/candidate/profile" element={
            <ProtectedRoute allowedRoles={['CANDIDATE']}>
              <DashboardLayout><CandidateProfilePage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/candidate/resume" element={
            <ProtectedRoute allowedRoles={['CANDIDATE']}>
              <DashboardLayout><ResumeUploadPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/candidate/applications" element={
            <ProtectedRoute allowedRoles={['CANDIDATE']}>
              <DashboardLayout><MyApplicationsPage /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Recruiter Routes */}
          <Route path="/recruiter/dashboard" element={
            <ProtectedRoute allowedRoles={['RECRUITER']}>
              <DashboardLayout><RecruiterDashboardPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/recruiter/jobs" element={
            <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
              <DashboardLayout><RecruiterJobsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/jobs/create" element={
            <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
              <DashboardLayout><JobCreateEditPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/jobs/:id/edit" element={
            <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
              <DashboardLayout><JobCreateEditPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/recruiter/jobs/:id/applicants" element={
            <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
              <DashboardLayout><ApplicantsManagementPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/recruiter/applications/:id" element={
            <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
              <DashboardLayout><ApplicationReviewPage /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout><AdminDashboardPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout><UserManagementPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/jobs" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout><RecruiterJobsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout><RecruitmentAnalyticsPage /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </AuthProvider>
  );
}

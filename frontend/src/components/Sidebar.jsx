import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  UserCheck, 
  Users, 
  BarChart3, 
  Upload, 
  PlusCircle, 
  FolderKanban
} from 'lucide-react';

export default function Sidebar() {
  const { role } = useAuth();

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    color: isActive ? '#1d4ed8' : '#475569',
    backgroundColor: isActive ? '#eff6ff' : 'transparent',
    fontWeight: isActive ? 700 : 500,
    fontSize: '0.925rem',
    textDecoration: 'none',
    transition: 'var(--transition)',
    marginBottom: '0.35rem',
  });

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid var(--border)',
      minHeight: 'calc(100vh - 65px)',
      padding: '1.5rem 1rem',
      flexShrink: 0
    }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
        {role === 'ADMIN' ? 'Platform Management' : role === 'RECRUITER' ? 'Recruiter Hub' : 'Job Seeker Portal'}
      </div>

      <nav>
        {role === 'CANDIDATE' && (
          <>
            <NavLink to="/candidate/dashboard" style={linkStyle}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/jobs" style={linkStyle}>
              <Briefcase size={18} /> Browse Jobs
            </NavLink>
            <NavLink to="/candidate/applications" style={linkStyle}>
              <FolderKanban size={18} /> My Applications
            </NavLink>
            <NavLink to="/candidate/profile" style={linkStyle}>
              <UserCheck size={18} /> Profile Details
            </NavLink>
            <NavLink to="/candidate/resume" style={linkStyle}>
              <Upload size={18} /> Resume & Files
            </NavLink>
          </>
        )}

        {role === 'RECRUITER' && (
          <>
            <NavLink to="/recruiter/dashboard" style={linkStyle}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/jobs/create" style={linkStyle}>
              <PlusCircle size={18} /> Post Open Position
            </NavLink>
            <NavLink to="/recruiter/jobs" style={linkStyle}>
              <Briefcase size={18} /> My Job Postings
            </NavLink>
          </>
        )}

        {role === 'ADMIN' && (
          <>
            <NavLink to="/admin/dashboard" style={linkStyle}>
              <LayoutDashboard size={18} /> Overview
            </NavLink>
            <NavLink to="/admin/users" style={linkStyle}>
              <Users size={18} /> User Management
            </NavLink>
            <NavLink to="/admin/jobs" style={linkStyle}>
              <Briefcase size={18} /> All Job Postings
            </NavLink>
            <NavLink to="/admin/analytics" style={linkStyle}>
              <BarChart3 size={18} /> Analytics & Reports
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}

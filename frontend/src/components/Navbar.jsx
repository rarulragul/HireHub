import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, LogOut, LayoutDashboard, Menu, X, Shield, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'RECRUITER') return '/recruiter/dashboard';
    return '/candidate/dashboard';
  };

  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            color: '#fff',
            borderRadius: '10px',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(37,99,235,0.3)'
          }}>
            <Briefcase size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>Hire</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#2563eb', letterSpacing: '-0.03em' }}>Hub</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="desktop-nav">
          <Link to="/jobs" style={{ fontWeight: 600, color: '#475569', fontSize: '0.925rem' }}>
            Find Jobs
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {role === 'RECRUITER' && (
                <Link to="/jobs/create" className="btn btn-primary btn-sm">
                  <PlusCircle size={16} /> Post a Job
                </Link>
              )}

              <Link to={getDashboardPath()} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>
                    {user?.full_name || user?.email}
                  </div>
                  <span className={`badge ${role === 'ADMIN' ? 'badge-rejected' : role === 'RECRUITER' ? 'badge-shortlisted' : 'badge-selected'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem' }}>
                    {role}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out" style={{ padding: '0.45rem' }}>
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

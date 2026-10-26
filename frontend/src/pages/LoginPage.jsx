import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogIn, AlertCircle, KeyRound, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'RECRUITER') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.error?.message || 'Login failed. Please verify your credentials.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickLogin = (quickEmail, quickPwd) => {
    setEmail(quickEmail);
    setPassword(quickPwd);
    setError('');
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      backgroundColor: '#f8fafc'
    }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            color: '#fff',
            borderRadius: '12px',
            width: '46px',
            height: '46px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 4px 10px rgba(37,99,235,0.25)'
          }}>
            <Briefcase size={24} />
          </div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to access your HireHub dashboard
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-control"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast Login Pills */}
        <div style={{ marginTop: '1.75rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.65rem', textAlign: 'center' }}>
            Quick Demo Logins (Click to autofill)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillQuickLogin('alex.dev@gmail.com', 'CandidatePassword123!')}
              style={{ justifyContent: 'flex-start', fontSize: '0.8rem' }}
            >
              <span className="badge badge-selected" style={{ marginRight: '0.5rem' }}>Candidate</span>
              alex.dev@gmail.com
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillQuickLogin('recruiter@google.com', 'RecruiterPassword123!')}
              style={{ justifyContent: 'flex-start', fontSize: '0.8rem' }}
            >
              <span className="badge badge-shortlisted" style={{ marginRight: '0.5rem' }}>Recruiter</span>
              recruiter@google.com
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillQuickLogin('admin@hirehub.com', 'AdminPassword123!')}
              style={{ justifyContent: 'flex-start', fontSize: '0.8rem' }}
            >
              <span className="badge badge-rejected" style={{ marginRight: '0.5rem' }}>Admin</span>
              admin@hirehub.com
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

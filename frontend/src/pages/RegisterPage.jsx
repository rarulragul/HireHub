import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, AlertCircle, User, Building } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('CANDIDATE');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await register({
        full_name: fullName,
        email,
        role,
        password,
        confirm_password: confirmPassword,
      });

      if (user.role === 'RECRUITER') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    } catch (err) {
      const respData = err.response?.data;
      if (respData) {
        if (respData.email) setError(respData.email[0]);
        else if (respData.confirm_password) setError(respData.confirm_password[0]);
        else if (respData.error?.message) setError(respData.error.message);
        else setError('Registration failed. Please check your details.');
      } else {
        setError('Network error. Unable to contact registration server.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      backgroundColor: '#f8fafc'
    }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem 2rem' }}>
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
            marginBottom: '1rem'
          }}>
            <Briefcase size={24} />
          </div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>Create Your Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join HireHub to apply for tech jobs or hire talent
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
          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">I want to:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setRole('CANDIDATE')}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${role === 'CANDIDATE' ? '#2563eb' : '#e2e8f0'}`,
                  backgroundColor: role === 'CANDIDATE' ? '#eff6ff' : '#ffffff',
                  color: role === 'CANDIDATE' ? '#1d4ed8' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                <User size={20} />
                <span>Find a Job</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('RECRUITER')}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${role === 'RECRUITER' ? '#2563eb' : '#e2e8f0'}`,
                  backgroundColor: role === 'RECRUITER' ? '#eff6ff' : '#ffffff',
                  color: role === 'RECRUITER' ? '#1d4ed8' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                <Building size={20} />
                <span>Hire Talent</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Alex Rivera"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password (min 6 characters)</label>
            <input
              type="password"
              required
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              required
              className="form-control"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Create HireHub Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Phone, MapPin, GraduationCap, Clock, Award, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    education: '',
    experience_years: 0,
    skills: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/candidates/me/');
        setProfile(res.data);
        setFormData({
          phone: res.data.phone || '',
          location: res.data.location || '',
          education: res.data.education || '',
          experience_years: res.data.experience_years || 0,
          skills: res.data.skills || '',
        });
      } catch (err) {
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const res = await api.put('/candidates/me/', formData);
      setProfile(res.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Error saving profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading candidate profile..." />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Candidate Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Keep your professional credentials up to date for recruiters.</p>
      </div>

      {success && (
        <div style={{
          backgroundColor: '#ecfdf5',
          color: '#065f46',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.5rem'
          }}>
            {profile?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem' }}>{profile?.full_name}</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{profile?.email}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location / City</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. San Francisco, CA (or Remote)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Highest Education</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. B.S. in Computer Science"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="50"
                className="form-control"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills (Comma-separated)</label>
            <textarea
              className="form-control"
              placeholder="e.g. Python, Django, React, MySQL, Docker, REST APIs"
              rows="3"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

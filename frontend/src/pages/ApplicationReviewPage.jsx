import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, User, Mail, Phone, MapPin, GraduationCap, Clock, FileText, Download, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ApplicationReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchApp = async () => {
    try {
      const res = await api.get(`/applications/${id}/`);
      setApp(res.data);
    } catch (err) {
      setError('Unable to fetch application details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApp();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    setMessage('');
    setError('');

    try {
      await api.patch(`/applications/${id}/status/`, { status: newStatus });
      setMessage(`Status successfully changed to ${newStatus}.`);
      await fetchApp();
    } catch (err) {
      setError('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadResume = async () => {
    try {
      const res = await api.get(`/applications/${id}/resume/`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${app?.candidate?.full_name?.replace(/\s+/g, '_')}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Could not download resume file.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading candidate application review..." />;

  const candidate = app?.candidate;
  const job = app?.job;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '0.5rem' }}
        >
          <ArrowLeft size={16} /> Return to Applicants
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Candidate Evaluation</h1>
            <p style={{ color: 'var(--text-muted)' }}>Position: <strong>{job?.title}</strong></p>
          </div>
          <div>
            <span className={`badge badge-${app?.status?.toLowerCase().replace('_', '-')}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
              {app?.status?.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {message && (
        <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Candidate Profile Details Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
            {candidate?.full_name?.charAt(0) || 'C'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem' }}>{candidate?.full_name}</h2>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{candidate?.email}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>Phone</div>
            <div style={{ fontWeight: 600 }}>{candidate?.phone || 'Not provided'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>Location</div>
            <div style={{ fontWeight: 600 }}>{candidate?.location || 'Not provided'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>Experience</div>
            <div style={{ fontWeight: 600 }}>{candidate?.experience_years} Years</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>Education</div>
            <div style={{ fontWeight: 600 }}>{candidate?.education || 'Not provided'}</div>
          </div>
        </div>

        {candidate?.skills && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>Verified Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {candidate.skills.split(',').map((skill, i) => (
                <span key={i} style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resume Box */}
        <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FileText size={22} color="#2563eb" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Candidate Resume (PDF)</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Authorized secure download link</div>
            </div>
          </div>
          {app?.has_resume ? (
            <button onClick={handleDownloadResume} className="btn btn-primary btn-sm">
              <Download size={15} /> Download Resume PDF
            </button>
          ) : (
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No resume uploaded</span>
          )}
        </div>
      </div>

      {/* Cover Letter */}
      {app?.cover_letter && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Applicant Note / Cover Letter</h3>
          <p style={{ lineHeight: 1.7, color: '#334155', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
            {app.cover_letter}
          </p>
        </div>
      )}

      {/* Recruitment Status Workflow Controls */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Update Recruitment Workflow Stage</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Transition this applicant to the next stage in your recruitment pipeline:
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            onClick={() => handleStatusChange('UNDER_REVIEW')}
            className={`btn ${app?.status === 'UNDER_REVIEW' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            disabled={updating}
          >
            Mark Under Review
          </button>
          <button
            onClick={() => handleStatusChange('SHORTLISTED')}
            className={`btn ${app?.status === 'SHORTLISTED' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            disabled={updating}
          >
            Shortlist Candidate
          </button>
          <button
            onClick={() => handleStatusChange('INTERVIEW')}
            className={`btn ${app?.status === 'INTERVIEW' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            disabled={updating}
          >
            Schedule Interview
          </button>
          <button
            onClick={() => handleStatusChange('SELECTED')}
            className={`btn ${app?.status === 'SELECTED' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ backgroundColor: app?.status === 'SELECTED' ? '#059669' : '', color: app?.status === 'SELECTED' ? '#fff' : '' }}
            disabled={updating}
          >
            Select / Make Offer
          </button>
          <button
            onClick={() => handleStatusChange('REJECTED')}
            className={`btn ${app?.status === 'REJECTED' ? 'btn-danger' : 'btn-secondary'} btn-sm`}
            disabled={updating}
          >
            Reject Candidate
          </button>
        </div>
      </div>
    </div>
  );
}

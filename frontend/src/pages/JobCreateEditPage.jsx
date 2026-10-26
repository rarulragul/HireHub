import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { Briefcase, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function JobCreateEditPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    required_skills: '',
    department: '',
    location: '',
    employment_type: 'FULL_TIME',
    experience_required: 0,
    salary_min: '',
    salary_max: '',
    application_deadline: '',
    status: 'OPEN',
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchJob = async () => {
        try {
          const res = await api.get(`/jobs/${id}/`);
          const job = res.data;
          setFormData({
            title: job.title || '',
            description: job.description || '',
            required_skills: job.required_skills || '',
            department: job.department || '',
            location: job.location || '',
            employment_type: job.employment_type || 'FULL_TIME',
            experience_required: job.experience_required || 0,
            salary_min: job.salary_min || '',
            salary_max: job.salary_max || '',
            application_deadline: job.application_deadline || '',
            status: job.status || 'OPEN',
          });
        } catch (err) {
          setError('Failed to load existing job details.');
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...formData,
      salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
      salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
      application_deadline: formData.application_deadline || null,
    };

    try {
      if (isEdit) {
        await api.put(`/jobs/${id}/`, payload);
      } else {
        await api.post('/jobs/', payload);
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      const msg = err.response?.data?.salary_max || err.response?.data?.error?.message || 'Error saving job posting.';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading job posting..." />;

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/recruiter/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          <ArrowLeft size={16} /> Back to Job Postings
        </Link>
        <h1 style={{ fontSize: '1.85rem' }}>{isEdit ? 'Edit Job Posting' : 'Create New Job Opening'}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Publish your job position to reach qualified candidates.</p>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Job Title *</label>
          <input
            type="text"
            required
            className="form-control"
            placeholder="e.g. Senior Full Stack Python Developer"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Department *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Software Engineering"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. San Francisco, CA or Remote"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Employment Type</label>
            <select
              className="form-control"
              value={formData.employment_type}
              onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Experience Required (Years)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="50"
              className="form-control"
              value={formData.experience_required}
              onChange={(e) => setFormData({ ...formData, experience_required: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="OPEN">Open (Accepting Applications)</option>
              <option value="DRAFT">Draft</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Minimum Salary ($)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 90000"
              value={formData.salary_min}
              onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Maximum Salary ($)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 130000"
              value={formData.salary_max}
              onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deadline (Optional)</label>
            <input
              type="date"
              className="form-control"
              value={formData.application_deadline}
              onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Required Skills (Comma-separated) *</label>
          <input
            type="text"
            required
            className="form-control"
            placeholder="e.g. Python, Django, React, MySQL, Docker"
            value={formData.required_skills}
            onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Job Description & Responsibilities *</label>
          <textarea
            required
            rows="6"
            className="form-control"
            placeholder="Provide a comprehensive job description, role objectives, day-to-day duties, and required qualifications..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Link to="/recruiter/jobs" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Publishing...' : isEdit ? 'Update Job Position' : 'Publish Job Position'}
          </button>
        </div>
      </form>
    </div>
  );
}

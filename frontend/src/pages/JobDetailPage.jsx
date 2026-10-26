import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { 
  Building, MapPin, DollarSign, Clock, Calendar, 
  CheckCircle2, AlertCircle, ArrowLeft, Send, FileText, Upload, Users, Edit3 
} from 'lucide-react';

export default function JobDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}/`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplying(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('cover_letter', coverLetter);
    if (resumeFile) {
      formData.append('resume_path', resumeFile);
    }

    try {
      await api.post(`/jobs/${id}/applications/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMsg('Your application was submitted successfully! The hiring team has been notified.');
      setApplyModalOpen(false);
      setCoverLetter('');
      setResumeFile(null);
      await fetchJob();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit application. Ensure you have an active resume uploaded.';
      setErrorMsg(msg);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading job specifications..." />;
  if (!job) return <div style={{ padding: '3rem', textAlign: 'center' }}>Job position not found.</div>;

  const isOwnerRecruiter = role === 'RECRUITER' && job.recruiter?.user?.email === user?.email;

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive market rate';
    if (min && max) return `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()} per year`;
    if (min) return `From $${Number(min).toLocaleString()} per year`;
    return `Up to $${Number(max).toLocaleString()} per year`;
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          <ArrowLeft size={16} /> Back to Search Results
        </Link>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <CheckCircle2 size={20} />
          <span style={{ fontWeight: 600 }}>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Job Header Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className={`badge ${job.status === 'OPEN' ? 'badge-open' : 'badge-closed'}`}>
                {job.status}
              </span>
              <span className="badge badge-applied">
                {job.employment_type?.replace('_', ' ')}
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', lineHeight: 1.2 }}>{job.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', color: '#334155', fontWeight: 600 }}>
              <Building size={20} color="#2563eb" />
              <span>{job.company_name || 'Verified Tech Employer'}</span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span style={{ color: '#64748b', fontWeight: 500 }}>{job.department}</span>
            </div>
          </div>

          <div>
            {isOwnerRecruiter ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/recruiter/jobs/${job.id}/applicants`} className="btn btn-primary btn-sm">
                  <Users size={16} /> View Applicants ({job.total_applicants})
                </Link>
                <Link to={`/jobs/${job.id}/edit`} className="btn btn-secondary btn-sm">
                  <Edit3 size={16} /> Edit Job
                </Link>
              </div>
            ) : job.has_applied ? (
              <div style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #bfdbfe' }}>
                <CheckCircle2 size={18} /> Application Submitted
              </div>
            ) : job.status === 'OPEN' ? (
              isAuthenticated ? (
                role === 'CANDIDATE' ? (
                  <button onClick={() => setApplyModalOpen(true)} className="btn btn-primary btn-lg">
                    Apply For Position
                  </button>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Recruiters & Admins cannot submit candidate applications
                  </div>
                )
              ) : (
                <Link to="/login" className="btn btn-primary btn-lg">
                  Sign in to Apply
                </Link>
              )
            ) : (
              <button disabled className="btn btn-secondary btn-lg">
                Position Closed
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <MapPin size={20} color="#64748b" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Location</div>
              <div style={{ fontWeight: 600 }}>{job.location}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <DollarSign size={20} color="#64748b" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Compensation</div>
              <div style={{ fontWeight: 600 }}>{formatSalary(job.salary_min, job.salary_max)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Clock size={20} color="#64748b" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Experience Level</div>
              <div style={{ fontWeight: 600 }}>{job.experience_required} Years Required</div>
            </div>
          </div>

          {job.application_deadline && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Calendar size={20} color="#64748b" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Deadline</div>
                <div style={{ fontWeight: 600 }}>{new Date(job.application_deadline).toLocaleDateString()}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description & Requirements */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Position Overview</h2>
            <div style={{ color: '#334155', lineHeight: 1.8, fontSize: '0.975rem', whiteSpace: 'pre-wrap' }}>
              {job.description}
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Skills & Qualifications</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {job.required_skills?.split(',').map((skill, idx) => (
                <span key={idx} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Hiring Organization</h3>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.25rem' }}>
              {job.company_name}
            </div>
            {job.recruiter?.company_description && (
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1rem' }}>
                {job.recruiter.company_description}
              </p>
            )}
            {job.recruiter?.company_website && (
              <a href={job.recruiter.company_website} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Visit Website &rarr;
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        <form onSubmit={handleApplySubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Your verified HireHub profile credentials will be provided to <strong>{job.company_name}</strong>.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Cover Note / Why You're a Great Fit (Optional)</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Highlight your relevant experience, technical achievements, or interest in this role..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Attach Specific Resume (Optional)</label>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
              If left blank, your default profile resume will be submitted.
            </p>
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="form-control"
              onChange={(e) => setResumeFile(e.target.files[0] || null)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setApplyModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={applying}>
              {applying ? 'Submitting Application...' : 'Confirm & Submit Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

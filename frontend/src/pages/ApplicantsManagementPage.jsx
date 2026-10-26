import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Users, FileText, CheckCircle2, Eye, Download } from 'lucide-react';

export default function ApplicantsManagementPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        api.get(`/jobs/${id}/`),
        api.get(`/jobs/${id}/applicants/${statusFilter ? `?status=${statusFilter}` : ''}`)
      ]);
      setJob(jobRes.data);
      setApplicants(appsRes.data.results || appsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, statusFilter]);

  const updateStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status/`, { status: newStatus });
      setMessage(`Applicant updated to ${newStatus}.`);
      await fetchData();
    } catch (err) {
      alert("Failed to update applicant status.");
    }
  };

  const downloadResume = async (appId, name) => {
    try {
      const res = await api.get(`/applications/${appId}/resume/`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name.replace(/\s+/g, '_')}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Resume file could not be downloaded.");
    }
  };

  if (loading) return <LoadingSpinner message="Loading candidate applicants..." />;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/recruiter/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          <ArrowLeft size={16} /> Back to Job Listings
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Applicants: {job?.title}</h1>
            <p style={{ color: 'var(--text-muted)' }}>{job?.department} • {job?.location} • {applicants.length} Total Applicants</p>
          </div>
          <div>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minWidth: '180px' }}
            >
              <option value="">All Statuses</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>
        </div>
      </div>

      {message && (
        <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {applicants.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Users size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>No Applicants Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>No candidate submissions match the selected filter.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Candidate Name & Email</th>
                <th>Experience</th>
                <th>Skills</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Change Status</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{app.candidate.full_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{app.candidate.email}</div>
                  </td>
                  <td>{app.candidate.experience_years} yrs</td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                      {app.candidate.skills ? app.candidate.skills.split(',').slice(0, 3).join(', ') : 'N/A'}
                    </span>
                  </td>
                  <td>
                    {app.has_resume ? (
                      <button
                        onClick={() => downloadResume(app.id, app.candidate.full_name)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', gap: '0.3rem' }}
                      >
                        <Download size={13} /> PDF
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>None</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge-${app.status.toLowerCase().replace('_', '-')}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-control"
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="SELECTED">Selected</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                  <td>
                    <Link
                      to={`/recruiter/applications/${app.id}`}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.35rem 0.65rem' }}
                    >
                      <Eye size={14} /> Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

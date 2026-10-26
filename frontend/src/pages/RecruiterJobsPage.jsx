import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusCircle, Users, Edit3, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/my/');
      setJobs(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      await api.patch(`/jobs/${job.id}/`, { status: newStatus });
      setMessage(`Job "${job.title}" marked as ${newStatus}.`);
      await fetchJobs();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the job posting "${title}"?`)) return;
    try {
      await api.delete(`/jobs/${id}/`);
      setMessage(`Job "${title}" deleted.`);
      await fetchJobs();
    } catch (err) {
      alert("Failed to delete job.");
    }
  };

  if (loading) return <LoadingSpinner message="Loading your job postings..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>My Job Openings</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your published listings and review applicant pools.</p>
        </div>
        <Link to="/jobs/create" className="btn btn-primary btn-sm">
          <PlusCircle size={16} /> Post New Job
        </Link>
      </div>

      {message && (
        <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          {message}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Job Postings Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Create your first job listing to start receiving candidate applications.</p>
          <Link to="/jobs/create" className="btn btn-primary">Create Job Posting</Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department</th>
                <th>Location</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>
                      <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {job.employment_type?.replace('_', ' ')}
                    </div>
                  </td>
                  <td>{job.department}</td>
                  <td>{job.location}</td>
                  <td>
                    <Link
                      to={`/recruiter/jobs/${job.id}/applicants`}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.35rem', fontWeight: 700 }}
                    >
                      <Users size={14} color="#2563eb" /> {job.total_applicants} Applicants
                    </Link>
                  </td>
                  <td>
                    <span className={`badge badge-${job.status === 'OPEN' ? 'open' : 'closed'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{new Date(job.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => toggleStatus(job)}
                        className="btn btn-secondary btn-sm"
                        title={job.status === 'OPEN' ? 'Close Job' : 'Reopen Job'}
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        {job.status === 'OPEN' ? 'Close' : 'Open'}
                      </button>
                      <Link
                        to={`/jobs/${job.id}/edit`}
                        className="btn btn-secondary btn-sm"
                        title="Edit Job"
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        <Edit3 size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(job.id, job.title)}
                        className="btn btn-danger btn-sm"
                        title="Delete Job"
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { FolderKanban, Building, MapPin, Calendar, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/my/');
      setApplications(res.data.results || res.data || []);
    } catch (err) {
      setError('Failed to fetch your applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) {
      return;
    }
    setWithdrawing(true);
    setMessage('');
    setError('');

    try {
      await api.patch(`/applications/${appId}/withdraw/`);
      setMessage('Application withdrawn successfully.');
      await fetchApplications();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to withdraw application.');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your applications..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>My Applications</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time status updates and submission history.</p>
        </div>
        <Link to="/jobs" className="btn btn-primary btn-sm">
          Browse More Jobs
        </Link>
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

      {applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <FolderKanban size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Applications Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Start applying to open engineering and tech roles today.</p>
          <Link to="/jobs" className="btn btn-primary">Find Suitable Jobs</Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Job Title & Organization</th>
                <th>Department</th>
                <th>Location</th>
                <th>Status</th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>
                      <Link to={`/jobs/${app.job.id}`}>{app.job.title}</Link>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {app.job.company_name}
                    </div>
                  </td>
                  <td>{app.job.department}</td>
                  <td>{app.job.location}</td>
                  <td>
                    <span className={`badge badge-${app.status.toLowerCase().replace('_', '-')}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="btn btn-secondary btn-sm"
                      >
                        Details
                      </button>
                      {app.status !== 'WITHDRAWN' && app.status !== 'SELECTED' && app.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          className="btn btn-danger btn-sm"
                          disabled={withdrawing}
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={selectedApp ? `${selectedApp.job.title} - Application Details` : ''}
      >
        {selectedApp && (
          <div>
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Company</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>{selectedApp.job.company_name}</div>
            </div>

            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Current Status</div>
              <div style={{ marginTop: '0.25rem' }}>
                <span className={`badge badge-${selectedApp.status.toLowerCase().replace('_', '-')}`}>
                  {selectedApp.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {selectedApp.cover_letter && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.4rem' }}>Your Cover Letter / Note</div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', lineHeight: 1.6, color: '#334155' }}>
                  {selectedApp.cover_letter}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

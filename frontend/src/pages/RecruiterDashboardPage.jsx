import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Briefcase, Users, CheckCircle, FilePlus, ArrowRight, Eye } from 'lucide-react';

export default function RecruiterDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/recruiter/');
        setData(res.data);
      } catch (err) {
        console.error("Recruiter dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading recruiter dashboard..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Recruiter Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your active job postings and evaluate incoming talent.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/jobs/create" className="btn btn-primary btn-sm">
            <FilePlus size={16} /> Post New Position
          </Link>
          <Link to="/recruiter/jobs" className="btn btn-secondary btn-sm">
            <Briefcase size={16} /> Manage Openings
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <DashboardCard title="Total Job Postings" value={data?.total_jobs} icon={Briefcase} color="#2563eb" />
        <DashboardCard title="Active Open Roles" value={data?.active_jobs} icon={CheckCircle} color="#059669" />
        <DashboardCard title="Total Candidates" value={data?.total_applicants} icon={Users} color="#7e22ce" />
        <DashboardCard title="Closed Postings" value={data?.closed_jobs} icon={Briefcase} color="#64748b" />
      </div>

      {/* Charts & Recent Applicants */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Applicant Volume per Role</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.job_chart || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="job_title" fontSize={11} stroke="#64748b" />
                <YAxis allowDecimals={false} fontSize={12} stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="applicants" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Recent Submissions</h3>
            <Link to="/recruiter/jobs" style={{ fontSize: '0.85rem', fontWeight: 600 }}>All Postings</Link>
          </div>

          {data?.recent_applicants?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
              <p>No candidate submissions received yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {data?.recent_applicants?.map((app) => (
                <div key={app.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{app.candidate_name}</h4>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Applied for: <strong>{app.job_title}</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge badge-${app.status.toLowerCase().replace('_', '-')}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                    <Link to={`/recruiter/applications/${app.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.65rem' }}>
                      <Eye size={14} /> Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FolderKanban, CheckCircle, Clock, Award, ArrowRight, Upload, Briefcase } from 'lucide-react';

export default function CandidateDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/candidate/');
        setData(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading candidate metrics..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Candidate Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track your submissions, interview milestones, and career prospects.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/jobs" className="btn btn-primary btn-sm">
            <Briefcase size={16} /> Explore Openings
          </Link>
          <Link to="/candidate/resume" className="btn btn-secondary btn-sm">
            <Upload size={16} /> Manage Resume
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <DashboardCard title="Total Applications" value={data?.total_applications} icon={FolderKanban} color="#2563eb" />
        <DashboardCard title="Under Review" value={data?.under_review} icon={Clock} color="#ca8a04" />
        <DashboardCard title="Shortlisted" value={data?.shortlisted} icon={CheckCircle} color="#0284c7" />
        <DashboardCard title="Offers / Selected" value={data?.selected} icon={Award} color="#059669" />
      </div>

      {/* Analytics Chart & Recent Submissions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Application Pipeline Breakdown</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.status_chart || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={12} stroke="#64748b" />
                <YAxis allowDecimals={false} fontSize={12} stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Recent Applications</h3>
            <Link to="/candidate/applications" style={{ fontSize: '0.85rem', fontWeight: 600 }}>View All</Link>
          </div>

          {data?.recent_applications?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
              <p>You haven't submitted any applications yet.</p>
              <Link to="/jobs" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {data?.recent_applications?.map((app) => (
                <div key={app.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{app.job_title}</h4>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {app.company_name} • {app.location}
                    </div>
                  </div>
                  <span className={`badge badge-${app.status.toLowerCase().replace('_', '-')}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Users, Briefcase, FolderKanban, ShieldCheck, ArrowRight, UserCheck, AlertTriangle } from 'lucide-react';

const COLORS = ['#2563eb', '#0284c7', '#059669', '#ca8a04', '#dc2626', '#64748b'];

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await api.get('/admin/dashboard/');
        setData(res.data);
      } catch (err) {
        console.error("Admin dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  if (loading) return <LoadingSpinner message="Loading system administration metrics..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Administrator Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Platform oversight, user verification, and recruitment analytics.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/users" className="btn btn-primary btn-sm">
            <Users size={16} /> Manage Users
          </Link>
          <Link to="/admin/jobs" className="btn btn-secondary btn-sm">
            <Briefcase size={16} /> All Jobs
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <DashboardCard title="Total Candidates" value={data?.total_candidates} icon={Users} color="#2563eb" />
        <DashboardCard title="Total Recruiters" value={data?.total_recruiters} icon={UserCheck} color="#0284c7" />
        <DashboardCard title="Active Jobs" value={data?.active_jobs} subtitle={`Out of ${data?.total_jobs || 0} total`} icon={Briefcase} color="#059669" />
        <DashboardCard title="All Applications" value={data?.total_applications} icon={FolderKanban} color="#7e22ce" />
      </div>

      {/* Analytics Visualization Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Recruitment Applications Volume Trend</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.monthly_trends || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" fontSize={12} stroke="#64748b" />
                <YAxis allowDecimals={false} fontSize={12} stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="applications" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Application Status Distribution</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.status_distribution || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={11} stroke="#64748b" />
                <YAxis allowDecimals={false} fontSize={12} stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Platform Registrations */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Recent Platform Users</h3>
          <Link to="/admin/users" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Manage All Users</Link>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {data?.recent_users?.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-rejected' : u.role === 'RECRUITER' ? 'badge-shortlisted' : 'badge-selected'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.is_active ? 'badge-open' : 'badge-closed'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(u.date_joined).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

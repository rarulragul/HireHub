import React, { useState, useEffect } from 'react';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Users, ShieldCheck, UserX, CheckCircle, AlertCircle } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);

      const res = await api.get(`/admin/users/?${params.toString()}`);
      setUsers(res.data.results || res.data || []);
    } catch (err) {
      setError('Failed to fetch user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const toggleStatus = async (user) => {
    const newStatus = !user.is_active;
    setMessage('');
    setError('');

    try {
      const res = await api.patch(`/admin/users/${user.id}/status/`, { is_active: newStatus });
      setMessage(res.data.message || `User ${user.email} updated.`);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user status.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>User Administration</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage user accounts, roles, and platform permissions.</p>
      </div>

      {message && (
        <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '280px' }}>
            <input
              type="text"
              placeholder="Search by name or email address..."
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <Search size={15} /> Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Role:</span>
            <select
              className="form-control"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="">All Roles</option>
              <option value="CANDIDATE">Candidates</option>
              <option value="RECRUITER">Recruiters</option>
              <option value="ADMIN">Administrators</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading user directory..." />
      ) : users.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: '#94a3b8' }}>No user accounts found matching your query.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Account Status</th>
                <th>Joined Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.full_name}</div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-rejected' : u.role === 'RECRUITER' ? 'badge-shortlisted' : 'badge-selected'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.is_active ? 'badge-open' : 'badge-closed'}`}>
                      {u.is_active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td>{new Date(u.date_joined).toLocaleDateString()}</td>
                  <td>
                    {u.role !== 'ADMIN' ? (
                      <button
                        onClick={() => toggleStatus(u)}
                        className={`btn ${u.is_active ? 'btn-danger' : 'btn-primary'} btn-sm`}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Protected</span>
                    )}
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

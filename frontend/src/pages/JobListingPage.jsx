import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, MapPin, Filter, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

export default function JobListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Search filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [department, setDepartment] = useState(searchParams.get('department') || '');
  const [employmentType, setEmploymentType] = useState(searchParams.get('employment_type') || '');

  const fetchJobs = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location) params.append('location', location);
    if (department) params.append('department', department);
    if (employmentType) params.append('employment_type', employmentType);
    params.append('page', page);

    try {
      const res = await api.get(`/jobs/?${params.toString()}`);
      setJobs(res.data.results || []);
      setTotalCount(res.data.count || 0);
      setTotalPages(res.data.total_pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, department, employmentType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setDepartment('');
    setEmploymentType('');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>Find Your Next Tech Role</h1>
        <p style={{ color: 'var(--text-muted)' }}>Explore verified openings from top companies.</p>
      </div>

      {/* Filter Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Title or skill (e.g. Django)"
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Location (e.g. Remote, Seattle)"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <select
                className="form-control"
                value={department}
                onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
              >
                <option value="">All Departments</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Backend Engineering">Backend Engineering</option>
                <option value="Frontend Engineering">Frontend Engineering</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Data Science">Data Science</option>
                <option value="DevOps">DevOps & Cloud</option>
              </select>
            </div>

            <div>
              <select
                className="form-control"
                value={employmentType}
                onChange={(e) => { setEmploymentType(e.target.value); setPage(1); }}
              >
                <option value="">All Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" onClick={handleReset} className="btn btn-secondary btn-sm">
              Reset Filters
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <Search size={15} /> Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>
          Showing <strong>{jobs.length}</strong> of <strong>{totalCount}</strong> open positions
        </div>
      </div>

      {/* Grid or Empty */}
      {loading ? (
        <LoadingSpinner message="Searching verified jobs..." />
      ) : jobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Briefcase size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Jobs Match Your Search</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Try broadening your search criteria or resetting filters.</p>
          <button onClick={handleReset} className="btn btn-secondary">Clear Filters</button>
        </div>
      ) : (
        <>
          <div className="grid-cards" style={{ marginBottom: '2.5rem' }}>
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

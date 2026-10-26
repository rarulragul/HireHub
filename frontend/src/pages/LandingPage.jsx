import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import JobCard from '../components/JobCard';
import { Search, MapPin, Briefcase, Users, Building, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs/?page_size=4');
        setFeaturedJobs(res.data.results || []);
      } catch (err) {
        console.error("Error fetching featured jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm) query.append('search', searchTerm);
    if (locationTerm) query.append('location', locationTerm);
    navigate(`/jobs?${query.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'radial-gradient(1000px 500px at 50% 0%, #1e3a8a 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '5rem 1.5rem 6rem',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <ShieldCheck size={16} color="#60a5fa" />
            <span>Enterprise Recruitment & Full-Stack Career Portal</span>
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.03em', color: '#ffffff' }}>
            Connect With Leading Tech Companies & Hire Elite Talent
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#cbd5e1', marginBottom: '2.5rem', maxWidth: '680px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            HireHub bridges the gap between ambitious developers, corporate HR recruiters, and talent acquisition teams with real-time tracking and verified workflows.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleSearch} style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '0.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
            maxWidth: '750px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '200px', padding: '0.5rem 0.75rem' }}>
              <Search size={20} color="#94a3b8" />
              <input
                type="text"
                placeholder="Job title, skills (e.g. Python, React)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '180px', padding: '0.5rem 0.75rem', borderLeft: '1px solid #e2e8f0' }}>
              <MapPin size={20} color="#94a3b8" />
              <input
                type="text"
                placeholder="Location (e.g. Remote, Seattle)"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
              Search Jobs
            </button>
          </form>

          {/* Seed demo quick logins helper */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#94a3b8' }}>
            <span>Pre-configured test accounts:</span>
            <span style={{ color: '#93c5fd' }}>Candidate: alex.dev@gmail.com</span>
            <span style={{ color: '#93c5fd' }}>Recruiter: recruiter@google.com</span>
            <span style={{ color: '#93c5fd' }}>Admin: admin@hirehub.com</span>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Explore Openings
            </div>
            <h2 style={{ fontSize: '1.85rem' }}>Featured Tech Opportunities</h2>
          </div>
          <Link to="/jobs" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            Browse All Positions <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid-cards">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Portal Roles Features */}
      <section style={{ backgroundColor: '#ffffff', padding: '4rem 1.5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Built For Every Stage of Recruitment</h2>
            <p style={{ color: 'var(--text-muted)' }}>Tailored capabilities designed for candidates, HR recruiters, and platform administrators.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Candidates */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>For Job Seekers</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Create your verified engineering profile, upload PDF resumes, apply with one click, and track your interview stage in real time.
              </p>
              <Link to="/register" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>Create Candidate Account</Link>
            </div>

            {/* Recruiters */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ backgroundColor: '#ecfdf5', color: '#059669', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Building size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>For HR & Recruiters</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Post openings, filter candidate pools, review verified resumes securely, and advance candidates through custom recruitment workflows.
              </p>
              <Link to="/register" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>Create Recruiter Account</Link>
            </div>

            {/* Admins */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ backgroundColor: '#faf5ff', color: '#7e22ce', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>For Administrators</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Global platform oversight, user activation control, system security, and recruitment trend analytics powered by Django aggregation.
              </p>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>Admin Portal Login</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Building, ArrowRight } from 'lucide-react';

export default function JobCard({ job }) {
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive';
    if (min && max) return `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()}`;
    if (min) return `From $${Number(min).toLocaleString()}`;
    return `Up to $${Number(max).toLocaleString()}`;
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <span className={`badge ${job.status === 'OPEN' ? 'badge-open' : 'badge-closed'}`} style={{ marginBottom: '0.5rem' }}>
              {job.employment_type?.replace('_', ' ')}
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
              <Link to={`/jobs/${job.id}`} style={{ color: 'inherit' }}>
                {job.title}
              </Link>
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          <Building size={16} color="#64748b" />
          <span>{job.company_name || 'Hiring Organization'}</span>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <span style={{ color: '#64748b', fontWeight: 500 }}>{job.department}</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={15} />
            <span>{job.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <DollarSign size={15} />
            <span>{formatSalary(job.salary_min, job.salary_max)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={15} />
            <span>{job.experience_required} yrs exp</span>
          </div>
        </div>

        {job.required_skills && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {job.required_skills.split(',').slice(0, 4).map((skill, idx) => (
              <span key={idx} style={{
                backgroundColor: '#f1f5f9',
                color: '#334155',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {skill.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          {job.total_applicants || 0} applicants
        </span>
        <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
          View Position <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

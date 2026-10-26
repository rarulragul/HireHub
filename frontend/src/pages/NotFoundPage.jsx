import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '480px', padding: '3rem 2rem' }}>
        <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <HelpCircle size={36} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.25rem', color: '#1e40af' }}>404</h1>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          The page or endpoint you are looking for has been moved or does not exist.
        </p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.4rem' }}>
          <ArrowLeft size={16} /> Return to HireHub
        </Link>
      </div>
    </div>
  );
}

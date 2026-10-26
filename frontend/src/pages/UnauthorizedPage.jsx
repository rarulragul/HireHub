import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '480px', padding: '3rem 2rem' }}>
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <ShieldAlert size={36} />
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Access Restricted</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          You do not have the required administrative or role permissions to view this resource.
        </p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.4rem' }}>
          <ArrowLeft size={16} /> Return to Homepage
        </Link>
      </div>
    </div>
  );
}

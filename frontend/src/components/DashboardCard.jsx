import React from 'react';

export default function DashboardCard({ title, value, icon: Icon, color = '#2563eb', subtitle }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
          {value !== undefined ? value : 0}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            {subtitle}
          </div>
        )}
      </div>
      {Icon && (
        <div style={{
          backgroundColor: `${color}15`,
          color: color,
          padding: '0.85rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={26} />
        </div>
      )}
    </div>
  );
}

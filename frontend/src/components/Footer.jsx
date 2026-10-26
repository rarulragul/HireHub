import React from 'react';
import { Briefcase, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#94a3b8',
      padding: '3rem 1.5rem 1.5rem',
      marginTop: 'auto',
      borderTop: '1px solid #1e293b'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem' }}>
        <div style={{ maxWidth: '350px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>
            <Briefcase size={22} color="#3b82f6" />
            <span>HireHub</span>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
            Enterprise recruitment and talent acquisition platform uniting top candidates, recruiters, and administrators in one high-performance system.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', marginBottom: '0.75rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li><a href="/jobs" style={{ color: '#94a3b8' }}>Explore Jobs</a></li>
            <li><a href="/register" style={{ color: '#94a3b8' }}>Register as Candidate</a></li>
            <li><a href="/register" style={{ color: '#94a3b8' }}>Hire Talent (Recruiter)</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', marginBottom: '0.75rem' }}>Tech Stack</h4>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
            Django 5 • REST Framework • MySQL 8 • React 18 • Vite • JWT Authentication
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto 0',
        paddingTop: '1.5rem',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>&copy; {new Date().getFullYear()} HireHub Portal. All rights reserved.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          Built with precision for enterprise hiring.
        </div>
      </div>
    </footer>
  );
}

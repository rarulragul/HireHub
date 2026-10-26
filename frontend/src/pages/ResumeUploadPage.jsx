import React, { useState, useEffect } from 'react';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { Upload, FileText, CheckCircle2, AlertCircle, Download, Trash2 } from 'lucide-react';

export default function ResumeUploadPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await api.get('/candidates/me/');
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.type !== 'application/pdf' && !selected.name.endsWith('.pdf')) {
        setError('Please select a valid PDF file.');
        setFile(null);
        return;
      }
      if (selected.size > 5 * 1024 * 1024) {
        setError('File size exceeds the 5MB limit.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selected);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setSuccess('');
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await api.post('/candidates/me/resume/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Resume uploaded successfully!');
      setFile(null);
      await fetchProfile();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await api.get('/candidates/resume/', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${profile?.full_name?.replace(/\s+/g, '_')}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Could not download resume file.');
    }
  };

  if (loading) return <LoadingSpinner message="Checking resume status..." />;

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Resume Management</h1>
        <p style={{ color: 'var(--text-muted)' }}>Upload and maintain your verified PDF resume for all applications.</p>
      </div>

      {success && (
        <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Current Resume Banner */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Active Profile Resume</h3>
        {profile?.has_resume ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-md)', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.65rem', borderRadius: '8px' }}>
                <FileText size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#1e3a8a' }}>PDF Resume Uploaded & Verified</div>
                <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>Last updated: {new Date(profile.updated_at).toLocaleDateString()}</div>
              </div>
            </div>
            <button onClick={handleDownload} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
              <Download size={16} /> Download Resume
            </button>
          </div>
        ) : (
          <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 'var(--radius-md)', textAlign: 'center', color: '#64748b' }}>
            <FileText size={32} style={{ margin: '0 auto 0.5rem', color: '#94a3b8' }} />
            <p style={{ fontWeight: 600 }}>No resume currently uploaded</p>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Upload a PDF resume below to submit applications immediately.</p>
          </div>
        )}
      </div>

      {/* Upload Box */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Upload or Replace Resume</h3>
        <form onSubmit={handleUpload}>
          <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '2.5rem 1.5rem', textAlign: 'center', cursor: 'pointer', backgroundColor: file ? '#eff6ff' : '#f8fafc', transition: 'var(--transition)' }}>
            <input
              type="file"
              accept=".pdf,application/pdf"
              id="resume-file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="resume-file" style={{ cursor: 'pointer', display: 'block' }}>
              <Upload size={36} color={file ? '#2563eb' : '#94a3b8'} style={{ margin: '0 auto 0.75rem' }} />
              {file ? (
                <div>
                  <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '1.05rem' }}>{file.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>Click to select a PDF file</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>Maximum file size: 5 MB</div>
                </div>
              )}
            </label>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            {file && (
              <button type="button" className="btn btn-secondary" onClick={() => setFile(null)}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={!file || uploading}>
              {uploading ? 'Uploading...' : 'Save Resume'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

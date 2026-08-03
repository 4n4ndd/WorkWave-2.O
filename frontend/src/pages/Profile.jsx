import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { User, FileText, Upload, Save, Briefcase, Award } from 'lucide-react';

const Profile = () => {
  const { user, refreshProfile, showToast } = useAuth();
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [updating, setUpdating] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setBio(user.bio || '');
      setSkills(user.skills || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put('/api/users/profile', { fullName, bio, skills });
      showToast('Profile updated successfully', 'success');
      await refreshProfile();
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/api/users/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Profile photo updated successfully', 'success');
      await refreshProfile();
    } catch (err) {
      showToast('Failed to upload photo', 'error');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/api/users/profile/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Resume uploaded successfully', 'success');
      await refreshProfile();
    } catch (err) {
      showToast('Failed to upload resume', 'error');
    } finally {
      setResumeUploading(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!user?.resumeUrl) return;
    try {
      const filename = user.resumeUrl.substring(user.resumeUrl.lastIndexOf('/') + 1);
      const res = await api.get(`/api/users/files/${filename}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (err) {
      showToast('Failed to download resume', 'error');
    }
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--border-focus)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const profilePhotoUrl = user.profilePhoto
    ? user.profilePhoto.startsWith('http')
      ? user.profilePhoto
      : `http://localhost:8080${user.profilePhoto}`
    : null;

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="grid-cols-3" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="profile-sidebar">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#1e293b', border: '3px solid var(--border-focus)', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '1.5rem' }}>
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={48} style={{ color: 'var(--text-muted)' }} />
                )}
                {photoUploading && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: '24px', height: '24px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  </div>
                )}
              </div>
              <label className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                <Upload size={14} />
                Change Photo
                <input type="file" onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />
              </label>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'Outfit', marginTop: '1.5rem', marginBottom: '0.25rem' }}>{user.fullName}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{user.email}</p>
              <span className="badge badge-pending" style={{ fontSize: '0.75rem', marginTop: '0.75rem' }}>{user.role}</span>
            </div>

            {user.role === 'USER' && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontFamily: 'Outfit', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} style={{ color: 'var(--accent-color)' }} />
                  Resume Attachment
                </h4>
                {user.resumeUrl ? (
                  <div>
                    <button onClick={handleDownloadResume} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.75rem', padding: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}>
                      <FileText size={14} />
                      Download Resume
                    </button>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1rem' }}>No resume uploaded yet.</p>
                )}
                <label className="btn btn-primary" style={{ width: '100%', fontSize: '0.75rem', padding: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center', cursor: 'pointer' }}>
                  <Upload size={14} />
                  {resumeUploading ? 'Uploading...' : 'Upload Resume'}
                  <input type="file" onChange={handleResumeUpload} accept=".pdf" style={{ display: 'none' }} />
                </label>
              </div>
            )}
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'Outfit', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={22} style={{ color: '#8b5cf6' }} />
              Profile Details
            </h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Bio / Description</label>
                <textarea
                  className="input-field"
                  placeholder="Describe your background, experiences, and passion..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="form-group">
                <label>Skills (Comma-separated)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Java, Spring Boot, React, MySQL"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }} disabled={updating}>
                <Save size={18} />
                {updating ? 'Saving changes...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .profile-sidebar { width: 100% !important; }
          div.grid-cols-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Calendar, Mail, FileText, ArrowLeft, Check, X, Clock } from 'lucide-react';

const ApplicantsList = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/api/applications/job/${jobId}`);
      setApplicants(res.data);
      if (res.data.length > 0) {
        setJobTitle(res.data[0].jobTitle);
      } else {
        const jobRes = await api.get(`/api/jobs/${jobId}`);
        setJobTitle(jobRes.data.title);
      }
    } catch (err) {
      showToast('Failed to load applicants', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await api.put(`/api/applications/status/${appId}?status=${newStatus}`);
      showToast(`Applicant status updated to ${newStatus}`, 'success');
      fetchApplicants();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDownloadResume = async (resumeUrl) => {
    try {
      const filename = resumeUrl.substring(resumeUrl.lastIndexOf('/') + 1);
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--border-focus)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} />
          Back
        </button>

        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', marginBottom: '0.5rem' }}>Applicants</h1>
          <p style={{ color: 'var(--text-muted)' }}>Reviewing candidates for <strong>{jobTitle}</strong></p>
        </div>

        {applicants.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <FileText size={48} style={{ stroke: 'var(--text-muted)', margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>No Applicants Yet</h3>
            <p style={{ color: 'var(--text-muted)' }}>We'll notify you as soon as candidates submit applications.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {applicants.map((app) => (
              <div key={app.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'Outfit', fontWeight: 600 }}>{app.userFullName}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Mail size={14} />
                        {app.userEmail}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        Applied: {new Date(app.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${app.status === 'ACCEPTED' ? 'badge-accepted' : app.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'}`}>
                    {app.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <button onClick={() => handleDownloadResume(app.resumeUrl)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
                    <FileText size={16} />
                    Download Resume
                  </button>
                  {app.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', background: 'var(--success-color)', boxShadow: 'none' }}>
                        <Check size={16} />
                        Accept
                      </button>
                      <button onClick={() => handleUpdateStatus(app.id, 'REJECTED')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', color: 'var(--error-color)' }}>
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsList;

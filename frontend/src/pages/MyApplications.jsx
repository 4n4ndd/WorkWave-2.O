import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Calendar, Briefcase, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const { showToast } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/api/applications/my');
      setApplications(res.data);
    } catch (err) {
      showToast('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'ACCEPTED') return 'badge-accepted';
    if (status === 'REJECTED') return 'badge-rejected';
    return 'badge-pending';
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
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', marginBottom: '0.5rem' }}>My Applications</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track the status of your job submissions.</p>
        </div>

        {applications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Briefcase size={48} style={{ stroke: 'var(--text-muted)', margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>No Applications Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't submitted applications to any job listings.</p>
            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {applications.map((app) => (
              <div key={app.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'Outfit', fontWeight: 600, marginBottom: '0.25rem' }}>{app.jobTitle}</h3>
                  <p style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem' }}>{app.company}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <Calendar size={12} />
                    <span>Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span className={`badge ${getStatusBadgeClass(app.status)}`}>{app.status}</span>
                  <Link to={`/jobs/${app.jobId}`} style={{ color: 'var(--text-muted)' }}>
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;

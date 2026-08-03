import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Calendar, Trash2, Users, Briefcase, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageJobs = () => {
  const { showToast } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await api.get('/api/jobs/posted');
      setJobs(res.data);
    } catch (err) {
      showToast('Failed to load your jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) return;
    try {
      await api.delete(`/api/jobs/${jobId}`);
      showToast('Job posting deleted successfully', 'success');
      fetchMyJobs();
    } catch (err) {
      showToast('Failed to delete job', 'error');
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
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', marginBottom: '0.5rem' }}>Manage Jobs</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage listings and review candidates.</p>
          </div>
          <Link to="/jobs/create" className="btn btn-primary">Post a New Job</Link>
        </div>

        {jobs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Briefcase size={48} style={{ stroke: 'var(--text-muted)', margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>No Jobs Posted</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't posted any job openings yet.</p>
            <Link to="/jobs/create" className="btn btn-primary">Post Your First Job</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {jobs.map((job) => (
              <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'Outfit', fontWeight: 600, marginBottom: '0.25rem' }}>{job.title}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} />
                      Posted: {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                    <span>Type: {job.jobType}</span>
                    <span>Location: {job.location}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link to={`/jobs/${job.id}/applicants`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Users size={14} />
                    View Applicants
                  </Link>
                  <Link to={`/jobs/${job.id}`} className="btn btn-secondary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
                    <Eye size={16} />
                  </Link>
                  <button onClick={() => handleDelete(job.id)} className="btn btn-danger" style={{ padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;

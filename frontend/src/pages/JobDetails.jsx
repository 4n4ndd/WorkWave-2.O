import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { MapPin, Briefcase, DollarSign, Calendar, Mail, ArrowLeft, Trash2 } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showToast } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/api/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      showToast('Failed to load job details', 'error');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      showToast('Please log in to apply for this job', 'error');
      navigate('/login');
      return;
    }
    setApplying(true);
    try {
      await api.post(`/api/applications/apply/${id}`);
      showToast('Application submitted successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application';
      showToast(msg, 'error');
      if (msg.includes('resume')) {
        navigate('/profile');
      }
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.delete(`/api/jobs/${id}`);
      showToast('Job posting deleted successfully', 'success');
      navigate('/jobs');
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

  const isOwnerOrAdmin = user && (user.role === 'ADMIN' || (user.role === 'RECRUITER' && job.createdBy === user.email));

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit', marginBottom: '0.5rem' }}>{job.title}</h1>
              <p style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.75rem' }}>{job.company}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={16} />
                  {job.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Briefcase size={16} />
                  {job.experienceRequired} Yrs Experience Required
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <DollarSign size={16} />
                  ${job.salary.toLocaleString()}/yr
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '150px' }}>
              <span className="badge badge-pending" style={{ alignSelf: 'flex-start' }}>{job.jobType}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Posted on {new Date(job.postedDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'Outfit', marginBottom: '1rem' }}>Job Description</h3>
            <p style={{ whiteSpace: 'pre-line', color: 'var(--text-main)', fontSize: '0.9375rem', lineHeight: '1.7' }}>{job.description}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', marginBottom: '2rem' }}>
            <Mail size={16} />
            <span>Contact Recruiter: <strong>{job.createdBy}</strong></span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {(!user || user.role === 'USER') && (
              <button onClick={handleApply} className="btn btn-primary" style={{ padding: '0.875rem 2rem' }} disabled={applying}>
                {applying ? 'Submitting Application...' : 'Apply Now'}
              </button>
            )}

            {isOwnerOrAdmin && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                {user.role === 'RECRUITER' && (
                  <Link to={`/jobs/manage`} className="btn btn-secondary">
                    Manage Posting
                  </Link>
                )}
                <button onClick={handleDelete} className="btn btn-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Trash2 size={16} />
                  Delete Posting
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

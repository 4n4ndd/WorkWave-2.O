import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CreateJob = () => {
  const { showToast } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [experienceRequired, setExperienceRequired] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !company || !location || !jobType || !experienceRequired || !salary || !description) {
      showToast('All fields are required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const data = {
        title,
        company,
        location,
        jobType,
        experienceRequired: parseInt(experienceRequired),
        salary: parseFloat(salary),
        description
      };
      await api.post('/api/jobs', data);
      showToast('Job posting created successfully!', 'success');
      navigate('/jobs/manage');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to post job';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="card">
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>Post a New Job</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>
            Fill in the specifications for the role you're looking to fill.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Senior Java Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid-cols-2">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. WorkWave"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Job Location</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. New York, NY (or Remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid-cols-3">
              <div className="form-group">
                <label>Job Type</label>
                <select className="input-field" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div className="form-group">
                <label>Experience (Years)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 3"
                  value={experienceRequired}
                  onChange={(e) => setExperienceRequired(e.target.value)}
                  min={0}
                  required
                />
              </div>
              <div className="form-group">
                <label>Salary (USD / Yr)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 95000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  min={0}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Job Description</label>
              <textarea
                className="input-field"
                placeholder="List roles, responsibilities, and technical requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                style={{ resize: 'vertical' }}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                {submitting ? 'Creating Posting...' : 'Publish Job'}
              </button>
              <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;

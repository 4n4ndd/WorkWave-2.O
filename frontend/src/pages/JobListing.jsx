import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Search, MapPin, Briefcase, DollarSign, Calendar, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobListing = () => {
  const { showToast } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [experienceRequired, setExperienceRequired] = useState('');
  const [jobType, setJobType] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 6,
        keyword: keyword || undefined,
        company: company || undefined,
        location: location || undefined,
        experienceRequired: experienceRequired ? parseInt(experienceRequired) : undefined,
        jobType: jobType || undefined
      };
      const res = await api.get('/api/jobs', { params });
      setJobs(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      showToast('Failed to load jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchJobs();
  };

  const handleClearFilters = () => {
    setKeyword('');
    setCompany('');
    setLocation('');
    setExperienceRequired('');
    setJobType('');
    setPage(0);
    setTimeout(() => fetchJobs(), 50);
  };

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', marginBottom: '0.5rem' }}>Explore Opportunities</h1>
          <p style={{ color: 'var(--text-muted)' }}>Find your next career leap at WorkWave.</p>
        </div>

        <form onSubmit={handleSearch} className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '0 1rem' }}>
              <Search size={20} style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Job title, keywords..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ border: 'none', background: 'none', padding: '0.75rem 0', boxShadow: 'none' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '0 1rem' }}>
              <MapPin size={20} style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Location (e.g. Remote, NY)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ border: 'none', background: 'none', padding: '0.75rem 0', boxShadow: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">Search</button>
              <button type="button" onClick={() => setShowFilters(!showFilters)} className="btn btn-secondary" style={{ padding: '0.75rem' }}>
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid-cols-3" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Google"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Job Type</label>
                <select className="input-field" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div className="form-group">
                <label>Max Experience Required (Years)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 5"
                  value={experienceRequired}
                  onChange={(e) => setExperienceRequired(e.target.value)}
                  min={0}
                />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={handleClearFilters} className="btn btn-secondary">Clear Filters</button>
              </div>
            </div>
          )}
        </form>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--border-focus)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div>
            {jobs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Briefcase size={48} style={{ stroke: 'var(--text-muted)', margin: '0 auto 1.5rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>No Jobs Found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search keywords or filter terms.</p>
              </div>
            ) : (
              <div>
                <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
                  {jobs.map((job) => (
                    <div key={job.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                          <h3 style={{ fontSize: '1.25rem', fontFamily: 'Outfit', fontWeight: 600 }}>{job.title}</h3>
                          <span className="badge badge-pending">{job.jobType}</span>
                        </div>
                        <p style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem' }}>{job.company}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={14} />
                            {job.location}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Briefcase size={14} />
                            {job.experienceRequired} Yrs Exp
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <DollarSign size={14} />
                            ${job.salary.toLocaleString()}/yr
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          <Calendar size={12} />
                          {new Date(job.postedDate).toLocaleDateString()}
                        </div>
                        <Link to={`/jobs/${job.id}`} className="btn btn-secondary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem' }}>View Details</Link>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      style={{ padding: '0.5rem' }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span style={{ fontSize: '0.875rem' }}>Page {page + 1} of {totalPages}</span>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page === totalPages - 1}
                      style={{ padding: '0.5rem' }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListing;

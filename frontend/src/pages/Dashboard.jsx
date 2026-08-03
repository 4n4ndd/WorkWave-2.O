import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Briefcase, FileText, CheckCircle, Clock, Trash2, ShieldAlert, Award, PlusCircle, Settings, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminRecruiters, setAdminRecruiters] = useState([]);

  useEffect(() => {
    fetchStats();
    if (user?.role === 'ADMIN') {
      fetchAdminData();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const endpoint = user?.role === 'ADMIN' ? '/api/admin/dashboard/stats' : '/api/users/dashboard/stats';
      const res = await api.get(endpoint);
      setStats(res.data);
    } catch (err) {
      showToast('Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const usersRes = await api.get('/api/admin/users');
      const recruitersRes = await api.get('/api/admin/recruiters');
      setAdminUsers(usersRes.data);
      setAdminRecruiters(recruitersRes.data);
    } catch (err) {
      showToast('Failed to load admin lists', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      showToast('User deleted successfully', 'success');
      fetchAdminData();
      fetchStats();
    } catch (err) {
      showToast('Failed to delete user', 'error');
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
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', marginBottom: '0.5rem' }}>Welcome, {user?.fullName}</h1>
          <span className="badge badge-pending" style={{ fontSize: '0.875rem' }}>Role: {user?.role}</span>
        </div>

        {user?.role === 'USER' && stats && (
          <div>
            <div className="grid-cols-3" style={{ marginBottom: '3rem' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(99, 102, 241, 0.1)' }}>
                  <Briefcase size={32} style={{ stroke: '#6366f1' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontFamily: 'Outfit' }}>{stats.recommendedJobsCount}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Recommended Jobs</p>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(56, 189, 248, 0.1)' }}>
                  <FileText size={32} style={{ stroke: '#38bdf8' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontFamily: 'Outfit' }}>{stats.appliedJobsCount}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Applied Jobs</p>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(16, 185, 129, 0.1)' }}>
                  <Award size={32} style={{ stroke: '#10b981' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontFamily: 'Outfit' }}>{stats.profileCompletionPercent}%</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Profile Completion</p>
                </div>
              </div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Outfit' }}>Find Your Next Opportunity</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
                Search through our premium catalog of validated jobs matching your profile experience.
              </p>
              <Link to="/jobs" className="btn btn-primary">Search Jobs</Link>
            </div>
          </div>
        )}

        {user?.role === 'RECRUITER' && stats && (
          <div>
            <div className="grid-cols-3" style={{ marginBottom: '3rem' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(99, 102, 241, 0.1)' }}>
                  <PlusCircle size={32} style={{ stroke: '#6366f1' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontFamily: 'Outfit' }}>{stats.totalJobsPosted}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Jobs Posted</p>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(56, 189, 248, 0.1)' }}>
                  <Users size={32} style={{ stroke: '#38bdf8' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontFamily: 'Outfit' }}>{stats.totalApplicationsReceived}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Applications Received</p>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(16, 185, 129, 0.1)' }}>
                  <CheckCircle size={32} style={{ stroke: '#10b981' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontFamily: 'Outfit' }}>{stats.totalCandidates}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Unique Candidates</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link to="/jobs/create" className="btn btn-primary">Post a New Job</Link>
              <Link to="/jobs/manage" className="btn btn-secondary">Manage Posted Jobs</Link>
            </div>
          </div>
        )}

        {user?.role === 'ADMIN' && stats && (
          <div>
            <div className="grid-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Users size={28} style={{ stroke: '#6366f1' }} />
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>{stats.totalUsers}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Candidates</p>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Settings size={28} style={{ stroke: '#10b981' }} />
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>{stats.totalRecruiters}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Recruiters</p>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Briefcase size={28} style={{ stroke: '#38bdf8' }} />
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>{stats.totalJobs}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Total Jobs</p>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <FileText size={28} style={{ stroke: '#f59e0b' }} />
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>{stats.totalApplications}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Applications</p>
                </div>
              </div>
            </div>

            <div className="grid-cols-2" style={{ marginTop: '2rem' }}>
              <div className="card">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Registered Candidates</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 0' }}>Name</th>
                        <th>Email</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.75rem 0' }}>{u.fullName}</td>
                          <td>{u.email}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button onClick={() => handleDeleteUser(u.id)} style={{ color: 'var(--error-color)', cursor: 'pointer' }}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Registered Recruiters</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 0' }}>Name</th>
                        <th>Email</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminRecruiters.map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.75rem 0' }}>{r.fullName}</td>
                          <td>{r.email}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button onClick={() => handleDeleteUser(r.id)} style={{ color: 'var(--error-color)', cursor: 'pointer' }}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

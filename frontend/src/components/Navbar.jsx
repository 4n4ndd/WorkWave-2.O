import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User as UserIcon, LogOut, Menu, X, LayoutDashboard, PlusCircle, List, UserCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav style={{ background: 'rgba(10, 14, 23, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)', sticky: 'top', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4.5rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.5rem', fontFamily: 'Outfit, sans-serif', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <Briefcase size={28} style={{ stroke: '#6366f1' }} />
          WorkWave
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-menu">
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          {user ? (
            <>
              {user.role === 'USER' && (
                <>
                  <Link to="/jobs" style={{ color: 'var(--text-muted)' }}>Jobs</Link>
                  <Link to="/applications" style={{ color: 'var(--text-muted)' }}>My Applications</Link>
                </>
              )}
              {user.role === 'RECRUITER' && (
                <>
                  <Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>
                  <Link to="/jobs/create" style={{ color: 'var(--text-muted)' }}>Post Job</Link>
                  <Link to="/jobs/manage" style={{ color: 'var(--text-muted)' }}>Manage Jobs</Link>
                </>
              )}
              {user.role === 'ADMIN' && (
                <Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>Admin Stats</Link>
              )}
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-main)', fontWeight: 500 }}>
                <UserIcon size={18} />
                Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/jobs" style={{ color: 'var(--text-muted)' }}>Browse Jobs</Link>
              <Link to="/login" style={{ color: 'var(--text-muted)' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>Get Started</Link>
            </>
          )}
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-toggle" style={{ display: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', background: '#0d1321', borderBottom: '1px solid var(--border-color)' }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          {user ? (
            <>
              {user.role === 'USER' && (
                <>
                  <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Jobs</Link>
                  <Link to="/applications" onClick={() => setMobileMenuOpen(false)}>My Applications</Link>
                </>
              )}
              {user.role === 'RECRUITER' && (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <Link to="/jobs/create" onClick={() => setMobileMenuOpen(false)}>Post Job</Link>
                  <Link to="/jobs/manage" onClick={() => setMobileMenuOpen(false)}>Manage Jobs</Link>
                </>
              )}
              {user.role === 'ADMIN' && (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Admin Stats</Link>
              )}
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="btn btn-danger" style={{ alignSelf: 'flex-start' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Browse Jobs</Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

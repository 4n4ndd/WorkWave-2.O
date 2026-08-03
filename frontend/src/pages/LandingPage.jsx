import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Briefcase, Users, Star } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', padding: '6rem 0' }}>
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: -1 }} />
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', lineHeight: '1.2', marginBottom: '1.5rem', fontFamily: 'Outfit, sans-serif' }}>
          Discover the Future of <br />
          <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Talent Acquisition
          </span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
          Connect with top-tier companies and matching jobs. WorkWave bridges developers, recruiters, and administrative workflows in a unified platform.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/jobs" className="btn btn-primary">
            Browse Opportunities
            <Search size={18} />
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Join the Community
            <ArrowRight size={18} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '6rem', borderTop: '1px solid var(--border-color)', paddingTop: '4rem' }} className="stats-grid">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-color)', fontFamily: 'Outfit' }}>10k+</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Listings</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-color)', fontFamily: 'Outfit' }}>500+</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Top Employers</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-color)', fontFamily: 'Outfit' }}>98%</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Match Rate</span>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

import React from 'react';

const Footer = () => {
  return (
    <footer style={{ background: '#070a10', borderTop: '1px solid var(--border-color)', padding: '2rem 0', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-main)' }}>WorkWave</span>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>&copy; {new Date().getFullYear()} WorkWave Inc. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;

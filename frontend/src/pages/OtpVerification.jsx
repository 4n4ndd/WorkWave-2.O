import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const OtpVerification = () => {
  const { verifyOtp, showToast } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      showToast('OTP must be exactly 6 digits', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await verifyOtp(email, otp);
      navigate('/dashboard');
    } catch (err) {
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/api/auth/resend-otp', { email });
      showToast('OTP resent to your email', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend OTP';
      showToast(msg, 'error');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center', fontFamily: 'Outfit' }}>Verify Account</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' }}>
          We have sent a 6-digit confirmation code to <strong>{email}</strong>.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>6-Digit Verification Code</label>
            <input
              type="text"
              className="input-field"
              placeholder="123456"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', fontWeight: 700 }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
            {submitting ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button onClick={handleResend} style={{ color: 'var(--accent-color)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }} disabled={resending}>
            {resending ? 'Sending...' : 'Resend Verification Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import OtpVerification from './pages/OtpVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import JobListing from './pages/JobListing';
import JobDetails from './pages/JobDetails';
import MyApplications from './pages/MyApplications';
import CreateJob from './pages/CreateJob';
import ManageJobs from './pages/ManageJobs';
import ApplicantsList from './pages/ApplicantsList';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<OtpVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/jobs" element={<JobListing />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/applications" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <MyApplications />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/jobs/create" 
                element={
                  <ProtectedRoute allowedRoles={['RECRUITER']}>
                    <CreateJob />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/jobs/manage" 
                element={
                  <ProtectedRoute allowedRoles={['RECRUITER']}>
                    <ManageJobs />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/jobs/:jobId/applicants" 
                element={
                  <ProtectedRoute allowedRoles={['RECRUITER']}>
                    <ApplicantsList />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

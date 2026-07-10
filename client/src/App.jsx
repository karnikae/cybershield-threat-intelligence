import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ThreatList from './pages/ThreatList';
import VulnerabilityReport from './pages/VulnerabilityReport';
import Predictions from './pages/Predictions';
import Recommendations from './pages/Recommendations';
import Chatbot from './pages/Chatbot';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route — requires token
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

import Insights from './pages/Insights';

// Admin Route — requires admin role
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" replace />;
  if (role !== 'admin') {
    return <Navigate to="/user" replace />;
  }
  return children;
};

// Layout wraps all protected pages with the Navbar
const Layout = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-background text-white selection:bg-primary/30">
      {token && !isAuthPage && <Navbar />}
      <div className={`flex-1 ${token && !isAuthPage ? 'ml-20 md:ml-64' : ''} p-4 md:p-8 overflow-y-auto`}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Area */}
          <Route path="/" element={
            <ProtectedRoute>
              <RootRedirect />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/threats" element={<ProtectedRoute><ThreatList /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
          
          {/* Admin-only Features */}
          <Route path="/vulnerabilities" element={<AdminRoute><VulnerabilityReport /></AdminRoute>} />
          <Route path="/predictions" element={<AdminRoute><Predictions /></AdminRoute>} />
          <Route path="/recommendations" element={<AdminRoute><Recommendations /></AdminRoute>} />
          
          <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

// Helper to handle root redirection based on role
const RootRedirect = () => {
  const role = localStorage.getItem('role');
  if (role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/user" replace />;
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Survey from './pages/Survey';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EventDetail from './pages/EventDetail';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import ChatAssistant from './components/ChatAssistant';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-background font-inter">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/survey" element={
                <ProtectedRoute>
                  <Survey />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <UserDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/event/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <EventDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/alerts" element={
                <ProtectedRoute>
                  <Layout>
                    <Alerts />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
            <ChatAssistant />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowLeft, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

export default function Signup() {
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, signUp } = useAuth();
  const { addNotification } = useNotifications();

  if (user) {
    return <Navigate to="/survey" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(email, userType === 'admin' ? password : undefined, userType === 'admin');
      
      if (error) {
        addNotification({
          type: 'error',
          title: 'Signup Failed',
          message: error.message,
        });
      } else {
        addNotification({
          type: 'success',
          title: 'Success!',
          message: userType === 'admin' 
            ? 'Admin account created. Please check your email to verify.'
            : 'Check your email for the verification link.',
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary-dark mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          
          <h2 className="text-h2 font-bold text-text-primary">
            Join PanPath Guardian
          </h2>
          <p className="mt-2 text-text-secondary">
            Help protect global health security
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-lg shadow-card p-8">
          {/* User Type Toggle */}
          <div className="flex bg-background rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setUserType('user')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
                userType === 'user' 
                  ? 'bg-card text-primary shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <User className="h-4 w-4" />
              <span className="font-medium">User</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
                userType === 'admin' 
                  ? 'bg-card text-primary shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span className="font-medium">Admin</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password (Admin only) */}
            {userType === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-text-secondary" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  Minimum 6 characters
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary mb-4">
              {userType === 'user' 
                ? 'You\'ll receive an email with a verification link'
                : 'Admin accounts require email verification'
              }
            </p>
            
            <p className="text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
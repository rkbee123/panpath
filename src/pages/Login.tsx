import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendingOtp, setResendingOtp] = useState(false);
  
  const { user, signIn, verifyOTP } = useAuth();
  const { addNotification } = useNotifications();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleResendOtp = async () => {
    setResendingOtp(true);
    try {
      const { error } = await signIn(email);
      if (error) {
        addNotification({
          type: 'error',
          title: 'Failed to Resend Code',
          message: error.message,
        });
      } else {
        addNotification({
          type: 'success',
          title: 'Code Sent',
          message: 'A new verification code has been sent to your email.',
        });
        setOtp(''); // Clear the old OTP
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to resend verification code.',
      });
    } finally {
      setResendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (otpSent && !isAdmin) {
        // Verify OTP for users
        const { error } = await verifyOTP(email, otp);
        if (error) {
          // Handle specific OTP errors
          if (error.message.includes('expired') || error.message.includes('invalid')) {
            addNotification({
              type: 'error',
              title: 'Verification Code Expired',
              message: 'Your verification code has expired or is invalid. Please request a new one.',
            });
          } else {
            addNotification({
              type: 'error',
              title: 'Verification Failed',
              message: error.message,
            });
          }
        } else {
          addNotification({
            type: 'success',
            title: 'Welcome!',
            message: 'Successfully logged in.',
          });
        }
      } else {
        // Sign in
        const { error } = await signIn(email, isAdmin ? password : undefined);
        if (error) {
          // Handle specific login errors
          if (error.message.includes('Invalid login credentials')) {
            addNotification({
              type: 'error',
              title: 'Invalid Credentials',
              message: 'Please double-check your email and password. If you\'re an admin and forgot your password, use the "Forgot password?" link below.',
            });
          } else {
            addNotification({
              type: 'error',
              title: 'Login Failed',
              message: error.message,
            });
          }
        } else if (!isAdmin) {
          setOtpSent(true);
          addNotification({
            type: 'success',
            title: 'Check Your Email',
            message: 'We sent you a verification code.',
          });
        } else {
          addNotification({
            type: 'success',
            title: 'Welcome Back!',
            message: 'Successfully logged in.',
          });
        }
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
            Sign in to PanPath Guardian
          </h2>
          <p className="mt-2 text-text-secondary">
            Access the global early warning system
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-lg shadow-card p-8">
          {/* User Type Toggle */}
          <div className="flex bg-background rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsAdmin(false)}
              className={`flex-1 py-2 px-4 rounded-md transition-all text-sm font-medium ${
                !isAdmin 
                  ? 'bg-card text-primary shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              User Login
            </button>
            <button
              type="button"
              onClick={() => setIsAdmin(true)}
              className={`flex-1 py-2 px-4 rounded-md transition-all text-sm font-medium ${
                isAdmin 
                  ? 'bg-card text-primary shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Admin Login
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
                  disabled={otpSent}
                />
              </div>
            </div>

            {/* Password (Admin) or OTP (User) */}
            {isAdmin ? (
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
                  />
                </div>
              </div>
            ) : otpSent && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-text-secondary">
                    Check your email for the 6-digit code
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendingOtp}
                    className="text-sm text-primary hover:text-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <RefreshCw className={`h-3 w-3 ${resendingOtp ? 'animate-spin' : ''}`} />
                    <span>{resendingOtp ? 'Sending...' : 'Resend Code'}</span>
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 
               otpSent && !isAdmin ? 'Verify Code' : 'Sign In'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            {isAdmin && (
              <Link
                to="#"
                className="text-sm text-primary hover:text-primary-dark"
              >
                Forgot your password?
              </Link>
            )}
            
            <p className="text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-primary-dark font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
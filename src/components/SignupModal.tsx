import React, { useState } from 'react';
import { X, User, Shield, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { addNotification } = useNotifications();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(email, password, userType === 'admin');
      
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
        onClose();
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Join PanPath Guardian</h2>
          <p className="text-text-secondary mt-2">Help protect global health security</p>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email
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
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            {userType === 'user' 
              ? 'You\'ll receive an email with a verification link'
              : 'Admin accounts require email verification'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
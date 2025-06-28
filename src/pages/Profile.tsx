import React, { useState } from 'react';
import { User, Mail, MapPin, Settings, Bell, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });
  
  const { user, isAdmin } = useAuth();
  const { addNotification } = useNotifications();

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user?.id,
          email: user?.email,
          name,
          location,
          preferences: {
            notifications,
            updatedAt: new Date().toISOString()
          }
        });

      if (error) {
        addNotification({
          type: 'error',
          title: 'Update Failed',
          message: 'Failed to update profile.',
        });
      } else {
        addNotification({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully.',
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h1 font-bold text-text-primary mb-2">
          Profile Settings
        </h1>
        <p className="text-text-secondary">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="bg-card rounded-lg shadow-card border border-border p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Basic Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-text-secondary" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-text-secondary cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-text-secondary" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-card rounded-lg shadow-card border border-border p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Notification Preferences</h2>
            </div>

            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', description: 'Receive alerts and updates via email' },
                { key: 'push', label: 'Push Notifications', description: 'Browser notifications for critical alerts' },
                { key: 'sms', label: 'SMS Notifications', description: 'Text messages for emergency alerts' },
              ].map((option) => (
                <div key={option.key} className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div>
                    <h3 className="font-medium text-text-primary">{option.label}</h3>
                    <p className="text-sm text-text-secondary">{option.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[option.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        [option.key]: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Account Status */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg shadow-card border border-border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-text-primary">Account Status</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Account Type</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isAdmin ? 'bg-primary bg-opacity-10 text-primary' : 'bg-success bg-opacity-10 text-success'
                }`}>
                  {isAdmin ? 'Admin' : 'User'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Email Verified</span>
                <span className="px-2 py-1 bg-success bg-opacity-10 text-success rounded-full text-xs font-medium">
                  Verified
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Member Since</span>
                <span className="text-sm text-text-primary">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-card border border-border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
            </div>

            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors">
                Download Data Export
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors">
                API Access Keys
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error hover:bg-opacity-10 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
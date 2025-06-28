import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { MapPin, Heart, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';

export default function Survey() {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState('');
  const [helpType, setHelpType] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (completed) {
    return <Navigate to="/dashboard" replace />;
  }

  const helpOptions = [
    'Data contribution',
    'Community advocacy',
    'Beta testing',
    'Research collaboration',
    'Technical feedback',
    'Spread awareness'
  ];

  const featureOptions = [
    'Real-time alerts',
    'Interactive maps',
    'Data visualization',
    'Mobile notifications',
    'API access',
    'Custom dashboards'
  ];

  const handleHelpTypeChange = (option: string) => {
    setHelpType(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleFeatureChange = (option: string) => {
    setFeatures(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          location,
          preferences: {
            helpType,
            features,
            surveyCompleted: true,
            completedAt: new Date().toISOString()
          }
        });

      if (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to save survey responses.',
        });
      } else {
        addNotification({
          type: 'success',
          title: 'Welcome!',
          message: 'Survey completed. Welcome to PanPath Guardian!',
        });
        setCompleted(true);
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

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // In a real app, you'd use a geocoding service
            setLocation('Auto-detected location');
            addNotification({
              type: 'success',
              title: 'Location Detected',
              message: 'Your location has been detected.',
            });
          } catch (error) {
            addNotification({
              type: 'error',
              title: 'Error',
              message: 'Failed to detect location.',
            });
          }
        },
        () => {
          addNotification({
            type: 'error',
            title: 'Location Access Denied',
            message: 'Please enter your location manually.',
          });
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-text-primary">Step {step} of 3</span>
            <span className="text-sm text-text-secondary">{Math.round((step / 3) * 100)}% complete</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-card p-8">
          {step === 1 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              
              <h2 className="text-h2 font-bold text-text-primary mb-4">
                What's your location?
              </h2>
              <p className="text-text-secondary mb-8">
                Help us provide relevant outbreak information for your region
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your city or region"
                  />
                </div>
                
                <button
                  onClick={detectLocation}
                  className="text-primary hover:text-primary-dark font-medium text-sm"
                >
                  Auto-detect my location
                </button>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!location.trim()}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              
              <h2 className="text-h2 font-bold text-text-primary mb-4">
                How would you like to help PanPath?
              </h2>
              <p className="text-text-secondary mb-8">
                Select all that apply - every contribution matters
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {helpOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleHelpTypeChange(option)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      helpType.includes(option)
                        ? 'border-primary bg-primary bg-opacity-10 text-primary'
                        : 'border-border hover:border-primary hover:bg-primary hover:bg-opacity-5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        helpType.includes(option) ? 'border-primary bg-primary' : 'border-border'
                      }`}>
                        {helpType.includes(option) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-text-secondary hover:text-text-primary font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={helpType.length === 0}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              
              <h2 className="text-h2 font-bold text-text-primary mb-4">
                What features matter most?
              </h2>
              <p className="text-text-secondary mb-8">
                Help us prioritize development based on your needs
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {featureOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFeatureChange(option)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      features.includes(option)
                        ? 'border-primary bg-primary bg-opacity-10 text-primary'
                        : 'border-border hover:border-primary hover:bg-primary hover:bg-opacity-5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        features.includes(option) ? 'border-primary bg-primary' : 'border-border'
                      }`}>
                        {features.includes(option) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="text-text-secondary hover:text-text-primary font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || features.length === 0}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Completing...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockData } from '../lib/api';
import { ApiService } from '../lib/api';
import { useNotifications } from '../contexts/NotificationContext';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { addNotification } = useNotifications();
  const event = mockData.events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">Event Not Found</h2>
          <p className="text-text-secondary mb-6">The requested event could not be found.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark border border-primary hover:border-primary-dark rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleInvestigate = async () => {
    try {
      await ApiService.triggerInvestigation(event.id);
      addNotification({
        type: 'success',
        title: 'Investigation Triggered',
        message: 'Investigation workflow has been initiated.',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Investigation Failed',
        message: 'Unable to trigger investigation. Please try again.',
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Mock trend data for charts
  const trendData = [
    { time: '00:00', wastewater: 20, pharmacy: 15, wearable: 25 },
    { time: '04:00', wastewater: 25, pharmacy: 20, wearable: 30 },
    { time: '08:00', wastewater: 35, pharmacy: 30, wearable: 45 },
    { time: '12:00', wastewater: 50, pharmacy: 45, wearable: 65 },
    { time: '16:00', wastewater: 75, pharmacy: 65, wearable: 80 },
    { time: '20:00', wastewater: 70, pharmacy: 60, wearable: 75 },
  ];

  const signalBreakdown = Object.entries(event.signals)
    .filter(([_, value]) => value !== undefined)
    .map(([signal, value]) => ({
      signal: signal.charAt(0).toUpperCase() + signal.slice(1),
      value: value as number,
    }));

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-h1 font-bold text-text-primary mb-2">
              {event.title}
            </h1>
            <div className="flex items-center space-x-4 text-text-secondary">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatTimestamp(event.created_at)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`px-4 py-2 rounded-lg font-semibold uppercase tracking-wide ${
              event.risk_level === 'high' ? 'bg-error text-white' :
              event.risk_level === 'medium' ? 'bg-warning text-white' :
              'bg-success text-white'
            }`}>
              {event.risk_level} Risk
            </span>
            
            <button
              onClick={handleInvestigate}
              className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
            >
              <Zap className="w-4 h-4 mr-2" />
              Investigate
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'graphs', name: 'Graphs' },
              { id: 'forecast', name: 'Forecast' },
              { id: 'actions', name: 'Actions' },
            ].map((tab) => (
              <button
                key={tab.id}
                className="py-4 px-1 border-b-2 border-primary text-primary font-medium text-sm"
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab Content */}
      <div className="space-y-8">
        {/* Event Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg shadow-card border border-border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-text-primary">Confidence Score</h3>
            </div>
            <div className="text-3xl font-bold text-text-primary mb-2">
              {Math.round(event.confidence_score * 100)}%
            </div>
            <p className="text-text-secondary text-sm">
              Based on {event.signal_types.length} signal sources
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-card border border-border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-text-primary">Location</h3>
            </div>
            <div className="text-lg font-semibold text-text-primary mb-1">
              {event.location}
            </div>
            <p className="text-text-secondary text-sm">
              {event.coordinates[1].toFixed(4)}, {event.coordinates[0].toFixed(4)}
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-card border border-border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-text-primary">Detection Time</h3>
            </div>
            <div className="text-lg font-semibold text-text-primary mb-1">
              {formatTimestamp(event.created_at)}
            </div>
            <p className="text-text-secondary text-sm">
              Local timezone
            </p>
          </div>
        </div>

        {/* Signal Analysis */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Signal Trends */}
          <div className="bg-card rounded-lg shadow-card border border-border p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-6">Signal Trends (24h)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="wastewater" 
                  stroke="#00C7B7" 
                  strokeWidth={2}
                  name="Wastewater"
                />
                <Line 
                  type="monotone" 
                  dataKey="pharmacy" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Pharmacy"
                />
                <Line 
                  type="monotone" 
                  dataKey="wearable" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Wearable"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Signal Breakdown */}
          <div className="bg-card rounded-lg shadow-card border border-border p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-6">Current Signal Strength</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={signalBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="signal" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#00C7B7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        {event.recommendation && (
          <div className="bg-card rounded-lg shadow-card border border-border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-success" />
              <h3 className="text-xl font-semibold text-text-primary">AI Recommendations</h3>
            </div>
            <div className="bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg p-4">
              <p className="text-text-primary">{event.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
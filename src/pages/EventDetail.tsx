import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockEvents } from '../data/mockData';
import RiskBadge from '../components/UI/RiskBadge';
import SignalBadge from '../components/UI/SignalBadge';

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = mockEvents.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-textSecondary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-textPrimary mb-2">Event Not Found</h2>
          <p className="text-textSecondary mb-6">The requested event could not be found.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-accent hover:text-primary border border-accent hover:border-primary rounded-md transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-accent hover:text-primary mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-2">
                {event.title}
              </h1>
              <div className="flex items-center space-x-4 text-textSecondary">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimestamp(event.timestamp)}</span>
                </div>
              </div>
            </div>
            <RiskBadge level={event.riskLevel} size="lg" />
          </div>
        </div>

        {/* Event Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
              <h3 className="text-lg font-semibold text-textPrimary">Confidence Score</h3>
            </div>
            <div className="text-3xl font-bold text-textPrimary mb-2">
              {Math.round(event.confidenceScore * 100)}%
            </div>
            <p className="text-textSecondary text-sm">
              Based on {event.signalTypes.length} signal sources
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-6 h-6 text-accent" />
              <h3 className="text-lg font-semibold text-textPrimary">Location</h3>
            </div>
            <div className="text-lg font-semibold text-textPrimary mb-1">
              {event.location.name}
            </div>
            <p className="text-textSecondary text-sm">
              {event.location.coordinates[1].toFixed(4)}, {event.location.coordinates[0].toFixed(4)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-accent" />
              <h3 className="text-lg font-semibold text-textPrimary">Detection Time</h3>
            </div>
            <div className="text-lg font-semibold text-textPrimary mb-1">
              {formatTimestamp(event.timestamp)}
            </div>
            <p className="text-textSecondary text-sm">
              Local timezone
            </p>
          </div>
        </div>

        {/* Signal Analysis */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Signal Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-textPrimary mb-6">Signal Trends (24h)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="wastewater" 
                  stroke="#00BFA6" 
                  strokeWidth={2}
                  name="Wastewater"
                />
                <Line 
                  type="monotone" 
                  dataKey="pharmacy" 
                  stroke="#F5B041" 
                  strokeWidth={2}
                  name="Pharmacy"
                />
                <Line 
                  type="monotone" 
                  dataKey="wearable" 
                  stroke="#E74C3C" 
                  strokeWidth={2}
                  name="Wearable"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Signal Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-textPrimary mb-6">Current Signal Strength</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={signalBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="signal" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#00BFA6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signal Types */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-textPrimary mb-6">Active Signal Sources</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {event.signalTypes.map((signalType) => {
              const value = event.signals[signalType];
              return (
                <div key={signalType} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <SignalBadge type={signalType} />
                  {value !== undefined && (
                    <div className="text-right">
                      <div className="text-lg font-semibold text-textPrimary">
                        {value}%
                      </div>
                      <div className="text-sm text-textSecondary">
                        Signal strength
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        {event.recommendation && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-semibold text-textPrimary">AI Recommendations</h3>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-textPrimary">{event.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
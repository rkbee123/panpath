import React, { useState } from 'react';
import { Globe, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { SignalType } from '../types';
import { mockEvents, mockAlerts } from '../data/mockData';
import LeafletMap from '../components/Dashboard/LeafletMap';
import SignalFilters from '../components/Dashboard/SignalFilters';
import EventFeed from '../components/Dashboard/EventFeed';

const Dashboard: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<SignalType[]>([]);

  const stats = [
    {
      icon: Globe,
      label: 'Active Monitors',
      value: '2,847',
      change: '+12',
      changeType: 'positive' as const,
    },
    {
      icon: Activity,
      label: 'Live Signals',
      value: '156.4K',
      change: '+8.2%',
      changeType: 'positive' as const,
    },
    {
      icon: TrendingUp,
      label: 'Risk Events',
      value: mockEvents.length.toString(),
      change: '+3',
      changeType: 'neutral' as const,
    },
    {
      icon: AlertTriangle,
      label: 'Active Alerts',
      value: mockAlerts.filter(alert => alert.active).length.toString(),
      change: mockAlerts.filter(alert => alert.level === 'critical').length > 0 ? 'Critical' : 'Normal',
      changeType: mockAlerts.filter(alert => alert.level === 'critical').length > 0 ? 'negative' : 'positive' as const,
    },
  ];

  const getChangeColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-yellow-600';
      default: return 'text-textSecondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-2">
            Global Health Intelligence Dashboard
          </h1>
          <p className="text-textSecondary text-lg">
            Real-time pathogen outbreak detection and early warning system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-textSecondary text-sm font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-textPrimary">
                    {stat.value}
                  </p>
                  <p className={`text-sm font-medium ${getChangeColor(stat.changeType)} mt-1`}>
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 bg-accent bg-opacity-10 rounded-lg">
                  <stat.icon className="h-6 w-6 text-accent" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Signal Filters */}
        <div className="mb-8">
          <SignalFilters 
            activeFilters={activeFilters}
            onFiltersChange={setActiveFilters}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Interactive Map - Updated to use Leaflet */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-bold text-textPrimary">Live Anomaly Heatmap</h2>
              </div>
              <div className="h-96 rounded-lg overflow-hidden">
                <LeafletMap activeFilters={activeFilters} className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Event Feed */}
          <div className="lg:col-span-1">
            <EventFeed events={mockEvents} activeFilters={activeFilters} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-textPrimary mb-4">Recent System Activity</h3>
            <div className="space-y-4">
              {[
                { time: '14:30', event: 'High-risk signal cluster detected in Mumbai', type: 'critical' },
                { time: '12:15', event: 'Acoustic monitoring active in São Paulo', type: 'info' },
                { time: '11:45', event: 'Wearable data sync completed for Lagos region', type: 'success' },
                { time: '10:20', event: 'Wastewater surveillance updated for London', type: 'info' },
                { time: '09:30', event: 'System health check completed successfully', type: 'success' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 py-2">
                  <div className="text-textSecondary text-sm font-mono">
                    {activity.time}
                  </div>
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      activity.type === 'critical' ? 'bg-red-500' :
                      activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  />
                  <div className="text-textPrimary text-sm flex-1">
                    {activity.event}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
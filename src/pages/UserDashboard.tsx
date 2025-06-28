import React, { useState, useEffect } from 'react';
import { Search, Globe, Activity, TrendingUp, AlertTriangle, Droplets, Pill, Heart, Mic, MessageSquare, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { ApiService, mockData } from '../lib/api';
import LeafletMap from '../components/Dashboard/LeafletMap';
import EventCard from '../components/EventCard';
import SignalFilter from '../components/SignalFilter';

export default function UserDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [events, setEvents] = useState(mockData.events);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { addNotification } = useNotifications();

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
      value: events.length.toString(),
      change: '+3',
      changeType: 'neutral' as const,
    },
    {
      icon: AlertTriangle,
      label: 'Active Alerts',
      value: mockData.alerts.filter(alert => alert.active).length.toString(),
      change: 'Critical',
      changeType: 'negative' as const,
    },
  ];

  const signalTypes = [
    { id: 'wastewater', name: 'Wastewater', icon: Droplets, color: 'bg-blue-500' },
    { id: 'pharmacy', name: 'Pharmacy', icon: Pill, color: 'bg-green-500' },
    { id: 'wearable', name: 'Wearables', icon: Heart, color: 'bg-red-500' },
    { id: 'acoustic', name: 'Cough Audio', icon: Mic, color: 'bg-purple-500' },
    { id: 'social', name: 'Social Media', icon: MessageSquare, color: 'bg-orange-500' },
    { id: 'syndromic', name: 'Syndromic', icon: Users, color: 'bg-pink-500' },
  ];

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const result = await ApiService.searchLocation(query);
      // Update map and events based on search result
      addNotification({
        type: 'info',
        title: 'Search Complete',
        message: `Found ${result.events?.length || 0} events for "${query}"`,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Search Failed',
        message: 'Unable to search location. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (activeFilters.length === 0) return true;
    return event.signal_types.some(type => activeFilters.includes(type));
  });

  const getChangeColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-error';
      case 'neutral': return 'text-warning';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h1 font-bold text-text-primary mb-2">
          Dashboard
        </h1>
        <p className="text-text-secondary">
          Welcome back, {user?.email?.split('@')[0]}. Monitor global outbreak signals in real-time.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-card rounded-lg shadow-card border border-border p-6 hover:shadow-card-hover transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className={`text-sm font-semibold ${getChangeColor(stat.changeType)}`}>
                {stat.change}
              </div>
            </div>
            
            <div>
              <div className="text-xs font-medium text-text-secondary mb-1 uppercase tracking-wide">
                {stat.label}
              </div>
              <div className="text-2xl font-bold text-text-primary">
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-5 w-5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Search by city/ZIP..."
          />
        </div>
      </div>

      {/* Signal Filters */}
      <div className="mb-8">
        <SignalFilter
          signalTypes={signalTypes}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Map Section - Updated to use Leaflet */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-card border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Global Threat Map
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-text-secondary">Live</span>
              </div>
            </div>
            <div className="h-96 rounded-lg overflow-hidden">
              <LeafletMap activeFilters={activeFilters.map(f => f as any)} className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Events Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              Live Events
            </h2>
            <div className="text-sm text-text-secondary">
              {filteredEvents.length} of {events.length}
              {activeFilters.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-xs font-medium">
                  Filtered
                </span>
              )}
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg shadow-card border border-border">
              <Activity className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No Events Found
              </h3>
              <p className="text-text-secondary">
                {activeFilters.length > 0 
                  ? 'Adjust signal filters to view more events'
                  : 'All systems monitoring normally'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredEvents.slice(0, 5).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-12">
        <div className="bg-card rounded-lg shadow-card border border-border p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-6">
            Recent System Activity
          </h3>
          
          <div className="space-y-3">
            {[
              { time: '14:30', event: 'High-risk signal cluster detected in Mumbai', type: 'critical', source: 'AI Detection' },
              { time: '12:15', event: 'Acoustic monitoring active in São Paulo', type: 'info', source: 'System' },
              { time: '11:45', event: 'Wearable data sync completed for Lagos region', type: 'success', source: 'Data Sync' },
              { time: '10:20', event: 'Wastewater surveillance updated for London', type: 'info', source: 'Data Update' },
              { time: '09:30', event: 'System health check completed successfully', type: 'success', source: 'Health Check' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 py-3 px-4 bg-background rounded-lg">
                <div className="text-text-secondary text-xs font-mono font-bold">
                  {activity.time}
                </div>
                <div 
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    activity.type === 'critical' ? 'bg-error animate-pulse' :
                    activity.type === 'success' ? 'bg-success' : 'bg-primary'
                  }`}
                />
                <div className="text-text-primary text-sm flex-1 font-medium">
                  {activity.event}
                </div>
                <div className="text-xs text-text-secondary font-medium uppercase tracking-wide">
                  {activity.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, MapPin, Filter } from 'lucide-react';
import { mockAlerts } from '../data/mockData';
import { AlertData } from '../types';

const Alerts: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const filteredAlerts = mockAlerts.filter(alert => {
    if (filter === 'active') return alert.active;
    if (filter === 'resolved') return !alert.active;
    return true;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const getAlertIcon = (level: AlertData['level'], active: boolean) => {
    if (!active) return CheckCircle;
    return level === 'critical' ? AlertTriangle : Clock;
  };

  const getAlertColor = (level: AlertData['level'], active: boolean) => {
    if (!active) return 'text-green-500 bg-green-50 border-green-200';
    return level === 'critical' 
      ? 'text-red-500 bg-red-50 border-red-200' 
      : 'text-yellow-500 bg-yellow-50 border-yellow-200';
  };

  const activeAlertsCount = mockAlerts.filter(alert => alert.active).length;
  const criticalAlertsCount = mockAlerts.filter(alert => alert.active && alert.level === 'critical').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-2">
            Alert Management
          </h1>
          <p className="text-textSecondary text-lg">
            Monitor and manage outbreak alerts and system notifications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-textSecondary text-sm font-medium">Critical Alerts</p>
                <p className="text-2xl font-bold text-textPrimary">{criticalAlertsCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-textSecondary text-sm font-medium">Active Alerts</p>
                <p className="text-2xl font-bold text-textPrimary">{activeAlertsCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-textSecondary text-sm font-medium">Resolved Today</p>
                <p className="text-2xl font-bold text-textPrimary">
                  {mockAlerts.filter(alert => !alert.active).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-textPrimary">Filter Alerts</h3>
            </div>
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Alerts' },
                { key: 'active', label: 'Active' },
                { key: 'resolved', label: 'Resolved' },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    filter === option.key
                      ? 'bg-accent text-white'
                      : 'text-textSecondary hover:text-textPrimary hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-textPrimary mb-2">No Alerts Found</h3>
              <p className="text-textSecondary">
                {filter === 'active' && 'No active alerts at this time.'}
                {filter === 'resolved' && 'No resolved alerts to display.'}
                {filter === 'all' && 'No alerts in the system.'}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const Icon = getAlertIcon(alert.level, alert.active);
              return (
                <div
                  key={alert.id}
                  className={`bg-white rounded-lg shadow-sm border p-6 ${
                    alert.active ? 'border-l-4' : ''
                  } ${
                    alert.active && alert.level === 'critical' 
                      ? 'border-l-red-500' 
                      : alert.active && alert.level === 'warning'
                      ? 'border-l-yellow-500'
                      : 'border-gray-200'
                  } animate-fade-in`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg border ${getAlertColor(alert.level, alert.active)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-textPrimary mb-2">
                            {alert.title}
                          </h3>
                          <p className="text-textSecondary mb-4">
                            {alert.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-textSecondary">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimestamp(alert.timestamp)}</span>
                            </div>
                            {alert.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{alert.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                          
                        <div className="flex items-center space-x-2 ml-4">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              alert.active
                                ? alert.level === 'critical'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {alert.active 
                              ? alert.level === 'critical' ? 'Critical' : 'Warning'
                              : 'Resolved'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
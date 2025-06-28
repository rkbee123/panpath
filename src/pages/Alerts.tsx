import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, MapPin, Filter } from 'lucide-react';
import { mockData } from '../lib/api';

export default function Alerts() {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const filteredAlerts = mockData.alerts.filter(alert => {
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

  const getAlertIcon = (level: string, active: boolean) => {
    if (!active) return CheckCircle;
    return level === 'critical' ? AlertTriangle : Clock;
  };

  const getAlertColor = (level: string, active: boolean) => {
    if (!active) return 'text-success bg-success bg-opacity-10 border-success border-opacity-20';
    return level === 'critical' 
      ? 'text-error bg-error bg-opacity-10 border-error border-opacity-20' 
      : 'text-warning bg-warning bg-opacity-10 border-warning border-opacity-20';
  };

  const activeAlertsCount = mockData.alerts.filter(alert => alert.active).length;
  const criticalAlertsCount = mockData.alerts.filter(alert => alert.active && alert.level === 'critical').length;

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h1 font-bold text-text-primary mb-2">
          Alert Management
        </h1>
        <p className="text-text-secondary">
          Monitor and manage outbreak alerts and system notifications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-lg shadow-card border border-border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-error bg-opacity-10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-error" />
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium">Critical Alerts</p>
              <p className="text-2xl font-bold text-text-primary">{criticalAlertsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-card border border-border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-warning bg-opacity-10 rounded-lg">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium">Active Alerts</p>
              <p className="text-2xl font-bold text-text-primary">{activeAlertsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-card border border-border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-success bg-opacity-10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium">Resolved Today</p>
              <p className="text-2xl font-bold text-text-primary">
                {mockData.alerts.filter(alert => !alert.active).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg shadow-card border border-border p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">Filter Alerts</h3>
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
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  filter === option.key
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background'
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
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Alerts Found</h3>
            <p className="text-text-secondary">
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
                className={`bg-card rounded-lg shadow-card border p-6 ${
                  alert.active ? 'border-l-4' : ''
                } ${
                  alert.active && alert.level === 'critical' 
                    ? 'border-l-error' 
                    : alert.active && alert.level === 'warning'
                    ? 'border-l-warning'
                    : 'border-border'
                } animate-fade-in`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg border ${getAlertColor(alert.level, alert.active)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-text-primary mb-2">
                          {alert.title}
                        </h3>
                        <p className="text-text-secondary mb-4">
                          {alert.message}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-text-secondary">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimestamp(alert.created_at)}</span>
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
                                ? 'bg-error bg-opacity-10 text-error'
                                : 'bg-warning bg-opacity-10 text-warning'
                              : 'bg-success bg-opacity-10 text-success'
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
  );
}
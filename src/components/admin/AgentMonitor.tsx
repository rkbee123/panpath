import React from 'react';
import { Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function AgentMonitor() {
  const agents = [
    { id: 'signal-monitor', name: 'Signal Monitor', status: 'running', lastRun: '2 minutes ago', success: 98.5 },
    { id: 'event-synthesizer', name: 'Event Synthesizer', status: 'running', lastRun: '5 minutes ago', success: 96.2 },
    { id: 'location-filter', name: 'Location Filter', status: 'running', lastRun: '1 minute ago', success: 99.1 },
    { id: 'map-updater', name: 'Map Updater', status: 'running', lastRun: '30 seconds ago', success: 97.8 },
    { id: 'alert-dispatcher', name: 'Alert Dispatcher', status: 'error', lastRun: '1 hour ago', success: 85.3 },
    { id: 'chat-assistant', name: 'Chat Assistant', status: 'running', lastRun: '10 seconds ago', success: 94.7 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return CheckCircle;
      case 'error': return AlertTriangle;
      case 'stopped': return Clock;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-success bg-success bg-opacity-10';
      case 'error': return 'text-error bg-error bg-opacity-10';
      case 'stopped': return 'text-warning bg-warning bg-opacity-10';
      default: return 'text-muted bg-muted bg-opacity-10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-text-primary">Agent Monitor</h2>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors">
          Restart All
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg shadow-card border border-border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-success bg-opacity-10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium">Running</p>
              <p className="text-2xl font-bold text-text-primary">
                {agents.filter(a => a.status === 'running').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-card border border-border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-error bg-opacity-10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-error" />
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium">Errors</p>
              <p className="text-2xl font-bold text-text-primary">
                {agents.filter(a => a.status === 'error').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-card border border-border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium">Total Agents</p>
              <p className="text-2xl font-bold text-text-primary">{agents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-card border border-border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-warning bg-opacity-10 rounded-lg">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium">Avg Success</p>
              <p className="text-2xl font-bold text-text-primary">
                {Math.round(agents.reduce((acc, a) => acc + a.success, 0) / agents.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agents List */}
      <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Last Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {agents.map((agent) => {
                const StatusIcon = getStatusIcon(agent.status);
                return (
                  <tr key={agent.id} className="hover:bg-background">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                            <Activity className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-text-primary">{agent.name}</div>
                          <div className="text-sm text-text-secondary">{agent.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="h-4 w-4 mr-2" />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agent.status)}`}>
                          {agent.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {agent.lastRun}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-border rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${agent.success}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-text-primary">
                          {agent.success}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-primary hover:text-primary-dark">
                          Restart
                        </button>
                        <button className="text-text-secondary hover:text-text-primary">
                          Logs
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
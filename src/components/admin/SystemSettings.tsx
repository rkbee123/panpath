import React, { useState } from 'react';
import { Settings, Key, Globe, Bell, Shield } from 'lucide-react';

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    apiKeys: {
      n8nWebhook: 'https://your-n8n-instance.com/webhook',
      mapboxToken: 'pk.your-mapbox-token',
      supabaseUrl: 'https://your-project.supabase.co',
      supabaseKey: 'your-anon-key',
    },
    features: {
      realTimeAlerts: true,
      autoInvestigation: false,
      publicDashboard: true,
      apiAccess: true,
    },
    notifications: {
      emailAlerts: true,
      slackIntegration: false,
      webhookNotifications: true,
    }
  });

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-text-primary">System Settings</h2>
        </div>
        <button 
          onClick={handleSave}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          Save Changes
        </button>
      </div>

      {/* API Configuration */}
      <div className="bg-card rounded-lg shadow-card border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Key className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">API Configuration</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              N8N Webhook URL
            </label>
            <input
              type="text"
              value={settings.apiKeys.n8nWebhook}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                apiKeys: { ...prev.apiKeys, n8nWebhook: e.target.value }
              }))}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Mapbox Token
            </label>
            <input
              type="password"
              value={settings.apiKeys.mapboxToken}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                apiKeys: { ...prev.apiKeys, mapboxToken: e.target.value }
              }))}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Supabase URL
            </label>
            <input
              type="text"
              value={settings.apiKeys.supabaseUrl}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                apiKeys: { ...prev.apiKeys, supabaseUrl: e.target.value }
              }))}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Supabase Anon Key
            </label>
            <input
              type="password"
              value={settings.apiKeys.supabaseKey}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                apiKeys: { ...prev.apiKeys, supabaseKey: e.target.value }
              }))}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="bg-card rounded-lg shadow-card border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Feature Flags</h3>
        </div>

        <div className="space-y-4">
          {[
            { key: 'realTimeAlerts', label: 'Real-time Alerts', description: 'Enable live alert notifications' },
            { key: 'autoInvestigation', label: 'Auto Investigation', description: 'Automatically trigger investigations for high-risk events' },
            { key: 'publicDashboard', label: 'Public Dashboard', description: 'Allow public access to dashboard' },
            { key: 'apiAccess', label: 'API Access', description: 'Enable external API access' },
          ].map((feature) => (
            <div key={feature.key} className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <h4 className="font-medium text-text-primary">{feature.label}</h4>
                <p className="text-sm text-text-secondary">{feature.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.features[feature.key as keyof typeof settings.features]}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    features: { ...prev.features, [feature.key]: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-card rounded-lg shadow-card border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Notification Settings</h3>
        </div>

        <div className="space-y-4">
          {[
            { key: 'emailAlerts', label: 'Email Alerts', description: 'Send alerts via email' },
            { key: 'slackIntegration', label: 'Slack Integration', description: 'Post alerts to Slack channels' },
            { key: 'webhookNotifications', label: 'Webhook Notifications', description: 'Send alerts to external webhooks' },
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <h4 className="font-medium text-text-primary">{notification.label}</h4>
                <p className="text-sm text-text-secondary">{notification.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, [notification.key]: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
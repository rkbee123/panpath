import React, { useState } from 'react';
import { Upload, Database, Users, Settings, Activity, BarChart3, Shield, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { ApiService } from '../lib/api';
import UserManagement from '../components/admin/UserManagement';
import DataExplorer from '../components/admin/DataExplorer';
import AgentMonitor from '../components/admin/AgentMonitor';
import SystemSettings from '../components/admin/SystemSettings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadData, setUploadData] = useState('');
  const [uploadType, setUploadType] = useState<'csv' | 'json'>('json');
  const [signalType, setSignalType] = useState('wastewater');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'data', name: 'Data Explorer', icon: Database },
    { id: 'agents', name: 'Agents', icon: Activity },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const handleDataUpload = async () => {
    if (!uploadData.trim()) {
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: 'Please provide data to upload',
      });
      return;
    }

    setLoading(true);
    try {
      let parsedData;
      if (uploadType === 'json') {
        parsedData = JSON.parse(uploadData);
      } else {
        parsedData = uploadData;
      }

      await ApiService.sendSignalData({
        type: uploadType,
        signalType,
        data: parsedData,
        timestamp: new Date().toISOString(),
      });

      addNotification({
        type: 'success',
        title: 'Upload Successful',
        message: `${signalType} data uploaded successfully`,
      });
      setUploadData('');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: error instanceof Error ? error.message : 'Upload failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: '1,247', icon: Users, color: 'bg-blue-500' },
                { label: 'Data Points', value: '2.4M', icon: Database, color: 'bg-green-500' },
                { label: 'Active Agents', value: '12', icon: Activity, color: 'bg-purple-500' },
                { label: 'System Health', value: '99.9%', icon: Shield, color: 'bg-primary' },
              ].map((stat, index) => (
                <div key={index} className="bg-card rounded-lg shadow-card border border-border p-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 ${stat.color} rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Upload Panel */}
            <div className="bg-card rounded-lg shadow-card border border-border p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Upload className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-text-primary">Signal Data Upload</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Upload Type */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Data Format
                    </label>
                    <div className="flex space-x-2">
                      {(['json', 'csv'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setUploadType(type)}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            uploadType === type
                              ? 'border-primary bg-primary bg-opacity-10 text-primary'
                              : 'border-border text-text-secondary hover:border-primary'
                          }`}
                        >
                          {type.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Signal Type */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Signal Type
                    </label>
                    <select
                      value={signalType}
                      onChange={(e) => setSignalType(e.target.value)}
                      className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="wastewater">Wastewater</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="wearable">Wearable</option>
                      <option value="acoustic">Acoustic</option>
                      <option value="social">Social</option>
                      <option value="syndromic">Syndromic</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Data Input */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      {uploadType.toUpperCase()} Data
                    </label>
                    <textarea
                      value={uploadData}
                      onChange={(e) => setUploadData(e.target.value)}
                      rows={6}
                      className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                      placeholder={uploadType === 'json' ? '{"timestamp": "2025-01-20T15:00:00Z", "location": "Mumbai", "value": 75}' : 'timestamp,location,value\n2025-01-20T15:00:00Z,Mumbai,75'}
                    />
                  </div>

                  <button
                    onClick={handleDataUpload}
                    disabled={loading || !uploadData.trim()}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Uploading...' : 'Upload Data'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'data':
        return <DataExplorer />;
      case 'agents':
        return <AgentMonitor />;
      case 'settings':
        return <SystemSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-h1 font-bold text-text-primary">
              Admin Dashboard
            </h1>
            <p className="text-text-secondary">
              System administration and data management
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
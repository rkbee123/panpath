import React, { useState } from 'react';
import { Database, Download, Filter, Calendar } from 'lucide-react';

export default function DataExplorer() {
  const [selectedTable, setSelectedTable] = useState('signals');
  const [dateRange, setDateRange] = useState('7d');
  
  const tables = [
    { id: 'signals', name: 'Signal Data', count: '2.4M' },
    { id: 'events', name: 'Events', count: '1.2K' },
    { id: 'alerts', name: 'Alerts', count: '456' },
    { id: 'users', name: 'Users', count: '1.2K' },
  ];

  const mockData = [
    { id: '1', timestamp: '2025-01-20T15:00:00Z', type: 'wastewater', location: 'Mumbai', value: 75, confidence: 0.87 },
    { id: '2', timestamp: '2025-01-20T14:30:00Z', type: 'pharmacy', location: 'São Paulo', value: 65, confidence: 0.72 },
    { id: '3', timestamp: '2025-01-20T14:00:00Z', type: 'wearable', location: 'Lagos', value: 58, confidence: 0.69 },
    { id: '4', timestamp: '2025-01-20T13:30:00Z', type: 'acoustic', location: 'London', value: 35, confidence: 0.45 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-text-primary">Data Explorer</h2>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Table
          </label>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.name} ({table.count})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Filter
          </label>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-text-secondary" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Filter data..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Limit
          </label>
          <select className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
            <option value="100">100 rows</option>
            <option value="500">500 rows</option>
            <option value="1000">1000 rows</option>
            <option value="all">All rows</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockData.map((row) => (
                <tr key={row.id} className="hover:bg-background">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-text-primary">
                    {row.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {new Date(row.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-primary bg-opacity-10 text-primary rounded-full">
                      {row.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    {row.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-primary">
                    {row.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    {Math.round(row.confidence * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
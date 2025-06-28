import React, { useState } from 'react';
import { Users, Search, MoreVertical, Shield, User, Mail } from 'lucide-react';

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const mockUsers = [
    { id: '1', email: 'admin@panpath.com', role: 'admin', name: 'System Admin', lastActive: '2 hours ago', status: 'active' },
    { id: '2', email: 'researcher@university.edu', role: 'user', name: 'Dr. Sarah Chen', lastActive: '1 day ago', status: 'active' },
    { id: '3', email: 'analyst@health.gov', role: 'user', name: 'Michael Rodriguez', lastActive: '3 days ago', status: 'active' },
    { id: '4', email: 'student@college.edu', role: 'user', name: 'Emma Thompson', lastActive: '1 week ago', status: 'inactive' },
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-text-primary">User Management</h2>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors">
          Invite User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-text-secondary" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Search users..."
        />
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-background">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text-primary">{user.name}</div>
                        <div className="text-sm text-text-secondary">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.role === 'admin' ? (
                        <Shield className="h-4 w-4 text-primary mr-2" />
                      ) : (
                        <User className="h-4 w-4 text-text-secondary mr-2" />
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-primary bg-opacity-10 text-primary' 
                          : 'bg-success bg-opacity-10 text-success'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'active' 
                        ? 'bg-success bg-opacity-10 text-success' 
                        : 'bg-muted bg-opacity-10 text-muted'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-text-secondary hover:text-text-primary">
                      <MoreVertical className="h-4 w-4" />
                    </button>
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
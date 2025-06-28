import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Alerts', href: '/alerts' },
    ...(isAdmin ? [{ name: 'Admin', href: '/admin' }] : []),
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary group-hover:text-primary-dark transition-colors" />
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 rounded-full animate-pulse-ring transition-opacity"></div>
            </div>
            <div className="font-inter">
              <span className="text-xl font-bold text-text-primary">PanPath</span>
              <span className="text-xl font-bold text-primary"> Guardian</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-button font-semibold transition-all duration-200 relative uppercase ${
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-primary'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Link
              to="/alerts"
              className="p-2 text-text-secondary hover:text-primary transition-colors rounded-lg hover:bg-background"
            >
              <Bell className="h-5 w-5" />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-2 p-2 text-text-secondary hover:text-primary transition-colors rounded-lg hover:bg-background"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:block text-sm font-medium">
                  {user?.email?.split('@')[0]}
                </span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-card border border-border">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-background"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-text-secondary hover:text-primary transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-3 text-base font-semibold transition-colors rounded-lg uppercase ${
                    isActive(item.href)
                      ? 'text-primary bg-background'
                      : 'text-text-secondary hover:text-primary hover:bg-background'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
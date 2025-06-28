import React from 'react';
import { Shield, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-text-primary text-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" />
              <div className="font-inter">
                <span className="text-xl font-bold">PanPath</span>
                <span className="text-xl font-bold text-primary"> Guardian</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              AI-powered, multi-signal platform that detects outbreaks days before clinical systems.
            </p>
            
            {/* Built with Bolt.new Badge */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">Built with</span>
              <a 
                href="https://bolt.new" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-primary hover:text-white transition-colors"
              >
                <span className="font-semibold">Bolt.new</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/dashboard" className="hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="/alerts" className="hover:text-primary transition-colors">Alerts</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Multi-Signal Detection</li>
              <li>AI-Powered Analysis</li>
              <li>Real-Time Monitoring</li>
              <li>Global Coverage</li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 PanPath Guardian. Built for global health security.
            </p>
            <div className="flex items-center space-x-6 text-xs text-gray-500">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Emergency Protocols</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
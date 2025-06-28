import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp } from 'lucide-react';

interface MapPin {
  id: string;
  coordinates: [number, number];
  riskLevel: 'low' | 'medium' | 'high';
  location: string;
  signalCount: number;
  lastUpdate: string;
}

export default function InteractiveMap() {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const mockPins: MapPin[] = [
    {
      id: '1',
      coordinates: [72.8777, 19.0760],
      riskLevel: 'high',
      location: 'Mumbai, India',
      signalCount: 3,
      lastUpdate: '2 hours ago',
    },
    {
      id: '2',
      coordinates: [-46.6333, -23.5505],
      riskLevel: 'medium',
      location: 'São Paulo, Brazil',
      signalCount: 2,
      lastUpdate: '4 hours ago',
    },
    {
      id: '3',
      coordinates: [3.3792, 6.5244],
      riskLevel: 'low',
      location: 'Lagos, Nigeria',
      signalCount: 1,
      lastUpdate: '6 hours ago',
    },
  ];

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Convert lat/lng to SVG coordinates (simplified projection)
  const projectCoordinates = (lng: number, lat: number) => {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  return (
    <div className="relative bg-gradient-to-br from-primary-dark via-primary to-primary-dark rounded-lg overflow-hidden h-96">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <svg viewBox="0 0 800 400" className="w-full h-full relative z-10">
        {/* World map outline */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Continent shapes */}
        <g fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
          {/* North America */}
          <path d="M80 80 L240 60 L280 100 L260 140 L220 180 L180 200 L120 180 L100 140 Z" />
          {/* South America */}
          <path d="M180 220 L240 210 L260 240 L280 300 L260 360 L220 380 L180 370 L160 340 L150 280 Z" />
          {/* Europe */}
          <path d="M420 60 L520 50 L540 80 L530 120 L480 140 L440 130 L410 100 Z" />
          {/* Africa */}
          <path d="M420 150 L520 140 L540 180 L560 250 L540 320 L500 350 L460 340 L440 300 L430 250 L440 200 Z" />
          {/* Asia */}
          <path d="M540 40 L780 30 L820 60 L840 100 L860 140 L840 180 L800 200 L750 190 L700 180 L650 170 L580 160 L540 120 Z" />
          {/* Australia */}
          <path d="M720 280 L800 270 L820 300 L810 330 L780 340 L740 335 L710 320 Z" />
        </g>

        {/* Risk level pins */}
        {mockPins.map((pin) => {
          const coords = projectCoordinates(pin.coordinates[0], pin.coordinates[1]);
          const isHovered = hoveredPin === pin.id;
          
          return (
            <g key={pin.id}>
              {/* Pulse animation for high risk */}
              {pin.riskLevel === 'high' && (
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="20"
                  fill={getRiskColor(pin.riskLevel)}
                  opacity="0.3"
                  className="animate-pulse"
                />
              )}
              
              {/* Main pin */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={isHovered ? "12" : "8"}
                fill={getRiskColor(pin.riskLevel)}
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200 hover:drop-shadow-lg"
                filter="url(#glow)"
                onMouseEnter={() => setHoveredPin(pin.id)}
                onMouseLeave={() => setHoveredPin(null)}
              />
              
              {/* Popup */}
              {isHovered && (
                <g>
                  <rect
                    x={coords.x + 15}
                    y={coords.y - 50}
                    width="200"
                    height="80"
                    rx="8"
                    fill="rgba(0,0,0,0.9)"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                  />
                  
                  <text x={coords.x + 25} y={coords.y - 25} fill="white" fontSize="12" fontWeight="600">
                    {pin.location}
                  </text>
                  
                  <text x={coords.x + 25} y={coords.y - 10} fill="#00C7B7" fontSize="10" fontWeight="500">
                    {pin.signalCount} signals • {pin.riskLevel} risk
                  </text>
                  
                  <text x={coords.x + 25} y={coords.y + 5} fill="rgba(255,255,255,0.7)" fontSize="9">
                    Updated {pin.lastUpdate}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg p-4 shadow-lg">
        <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>Risk Levels</span>
        </h4>
        <div className="space-y-2">
          {[
            { level: 'high', label: 'High Risk', count: mockPins.filter(p => p.riskLevel === 'high').length },
            { level: 'medium', label: 'Medium Risk', count: mockPins.filter(p => p.riskLevel === 'medium').length },
            { level: 'low', label: 'Low Risk', count: mockPins.filter(p => p.riskLevel === 'low').length },
          ].map((item) => (
            <div key={item.level} className="flex items-center justify-between space-x-3 text-xs">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getRiskColor(item.level as any) }}
                />
                <span className="text-text-secondary font-medium">{item.label}</span>
              </div>
              <span className="text-text-primary font-semibold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-95 rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-text-primary">Live</span>
        </div>
      </div>
    </div>
  );
}
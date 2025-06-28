import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, TrendingUp, Users, ArrowRight, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Event {
  id: string;
  title: string;
  location: string;
  coordinates: [number, number];
  risk_level: 'low' | 'medium' | 'high';
  confidence_score: number;
  signal_types: string[];
  signals: any;
  affected_population?: number;
  recommendation?: string;
  created_at: string;
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const formatPopulation = (population?: number) => {
    if (!population) return 'N/A';
    if (population >= 1000000) return `${(population / 1000000).toFixed(1)}M`;
    if (population >= 1000) return `${(population / 1000).toFixed(0)}K`;
    return population.toString();
  };

  const getRiskConfig = () => {
    switch (event.risk_level) {
      case 'high':
        return {
          color: 'bg-error text-white',
          icon: AlertTriangle,
          label: 'HIGH RISK',
          pulse: 'animate-pulse'
        };
      case 'medium':
        return {
          color: 'bg-warning text-white',
          icon: AlertCircle,
          label: 'MEDIUM RISK',
          pulse: ''
        };
      case 'low':
        return {
          color: 'bg-success text-white',
          icon: CheckCircle,
          label: 'LOW RISK',
          pulse: ''
        };
      default:
        return {
          color: 'bg-muted text-white',
          icon: AlertCircle,
          label: 'UNKNOWN',
          pulse: ''
        };
    }
  };

  // Mock sparkline data
  const sparklineData = [
    { value: 20 }, { value: 25 }, { value: 35 }, { value: 45 }, 
    { value: Math.round(event.confidence_score * 100) }
  ];

  const riskConfig = getRiskConfig();
  const RiskIcon = riskConfig.icon;

  return (
    <div className="event-card bg-card rounded-lg shadow-card border border-border p-6 hover:shadow-card-hover transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {event.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate font-medium">{event.location}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">{formatTimestamp(event.created_at)}</span>
            </div>
            
            {event.affected_population && (
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{formatPopulation(event.affected_population)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Risk Status Badge */}
        <div className={`px-3 py-2 rounded-lg ${riskConfig.color} ${riskConfig.pulse} flex items-center space-x-2`}>
          <RiskIcon className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wide">
            {riskConfig.label}
          </span>
        </div>
      </div>

      {/* Confidence Score with Sparkline */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm text-text-secondary font-medium uppercase tracking-wide">
            Confidence
          </span>
          <span className="text-lg font-bold text-text-primary">
            {Math.round(event.confidence_score * 100)}%
          </span>
        </div>
        
        {/* Mini Sparkline Chart */}
        <div className="w-20 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#00C7B7" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-border rounded-full h-2 mb-4">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${event.confidence_score * 100}%` }}
        />
      </div>

      {/* Signal Types */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {event.signal_types.slice(0, 4).map((signalType) => (
            <span 
              key={signalType}
              className="px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs font-semibold rounded uppercase tracking-wide border border-primary border-opacity-20"
            >
              {signalType}
              {event.signals[signalType] && (
                <span className="ml-1 opacity-75">
                  {event.signals[signalType]}%
                </span>
              )}
            </span>
          ))}
          {event.signal_types.length > 4 && (
            <span className="px-2 py-1 text-xs font-medium text-text-secondary bg-background rounded uppercase tracking-wide">
              +{event.signal_types.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-xs text-text-secondary font-medium uppercase tracking-wide">
            {event.signal_types.length} Signal{event.signal_types.length !== 1 ? 's' : ''} • ID: {event.id}
          </div>
          <Link
            to={`/event/${event.id}`}
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-lg transition-all duration-200 group-hover:shadow-card uppercase tracking-wide"
          >
            Investigate
            <ArrowRight className="ml-2 w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
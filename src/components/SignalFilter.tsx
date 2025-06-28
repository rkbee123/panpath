import React from 'react';
import { Filter } from 'lucide-react';

interface SignalType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface SignalFilterProps {
  signalTypes: SignalType[];
  activeFilters: string[];
  onFiltersChange: (filters: string[]) => void;
}

export default function SignalFilter({ signalTypes, activeFilters, onFiltersChange }: SignalFilterProps) {
  const toggleFilter = (signalId: string) => {
    if (activeFilters.includes(signalId)) {
      onFiltersChange(activeFilters.filter(filter => filter !== signalId));
    } else {
      onFiltersChange([...activeFilters, signalId]);
    }
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  const selectAllFilters = () => {
    onFiltersChange(signalTypes.map(s => s.id));
  };

  return (
    <div className="bg-card rounded-lg shadow-card border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Signal Sources
            </h3>
            <p className="text-xs text-text-secondary uppercase tracking-wide">
              Filter by data source type
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={selectAllFilters}
            className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors duration-200 uppercase tracking-wide"
          >
            Select All
          </button>
          <span className="text-text-secondary">|</span>
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors duration-200 uppercase tracking-wide"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {signalTypes.map((signal) => {
          const isActive = activeFilters.includes(signal.id);
          const Icon = signal.icon;
          
          return (
            <button
              key={signal.id}
              onClick={() => toggleFilter(signal.id)}
              className={`signal-pill group relative p-4 rounded-lg border-2 transition-all duration-200 ${
                isActive 
                  ? 'border-primary bg-primary bg-opacity-10 shadow-card' 
                  : 'border-border hover:border-primary hover:bg-primary hover:bg-opacity-5'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-primary bg-opacity-20' : 'bg-background'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-text-secondary'}`} />
                </div>
                
                <div className="text-center">
                  <div className={`text-xs font-semibold uppercase tracking-wide ${
                    isActive ? 'text-primary' : 'text-text-primary'
                  }`}>
                    {signal.name}
                  </div>
                </div>
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-card animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter Status */}
      {activeFilters.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                {activeFilters.length} of {signalTypes.length} sources active
              </span>
            </div>
            <div className="text-xs font-semibold text-primary uppercase tracking-wide">
              Live Filtering
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
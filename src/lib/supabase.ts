import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Force OTP instead of magic links
    flowType: 'pkce',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name?: string;
  location?: string;
  preferences?: any;
  created_at: string;
  updated_at: string;
}

export interface Event {
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
  updated_at: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  level: 'warning' | 'critical';
  location?: string;
  active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface SignalData {
  id: string;
  type: 'wastewater' | 'pharmacy' | 'wearable' | 'acoustic' | 'social' | 'syndromic';
  location: string;
  coordinates: [number, number];
  value: number;
  metadata: any;
  created_at: string;
}
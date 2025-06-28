// N8N Webhook URLs
const N8N_BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook';

export const webhooks = {
  signalMonitor: `${N8N_BASE_URL}/signal-monitor`,
  eventSynthesizer: `${N8N_BASE_URL}/event-synthesizer`,
  locationFilter: `${N8N_BASE_URL}/location-filter`,
  mapUpdater: `${N8N_BASE_URL}/map-updater`,
  alertDispatcher: `${N8N_BASE_URL}/alert-dispatcher`,
  chatAssistant: `${N8N_BASE_URL}/chat-assistant`,
};

// API Service
export class ApiService {
  static async sendSignalData(data: any) {
    try {
      const response = await fetch(webhooks.signalMonitor, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending signal data:', error);
      throw error;
    }
  }

  static async searchLocation(query: string) {
    try {
      const response = await fetch(webhooks.locationFilter, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error searching location:', error);
      throw error;
    }
  }

  static async triggerInvestigation(eventId: string) {
    try {
      const response = await fetch(webhooks.eventSynthesizer, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'investigate', eventId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error triggering investigation:', error);
      throw error;
    }
  }

  static async sendAlert(alertData: any) {
    try {
      const response = await fetch(webhooks.alertDispatcher, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending alert:', error);
      throw error;
    }
  }

  static async chatWithAssistant(message: string, context?: any) {
    try {
      const response = await fetch(webhooks.chatAssistant, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, context }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error chatting with assistant:', error);
      throw error;
    }
  }
}

// Mock data for development
export const mockData = {
  events: [
    {
      id: '1',
      title: 'Respiratory Symptoms Spike in Mumbai',
      location: 'Mumbai, India',
      coordinates: [72.8777, 19.0760] as [number, number],
      risk_level: 'high' as const,
      confidence_score: 0.87,
      signal_types: ['wastewater', 'pharmacy', 'wearable'],
      signals: { wastewater: 75, pharmacy: 65, wearable: 80 },
      affected_population: 125000,
      recommendation: 'Deploy mobile testing units. Increase pharmacy surveillance.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Cough Audio Anomaly in São Paulo',
      location: 'São Paulo, Brazil',
      coordinates: [-46.6333, -23.5505] as [number, number],
      risk_level: 'medium' as const,
      confidence_score: 0.72,
      signal_types: ['acoustic', 'social'],
      signals: { acoustic: 68, social: 45 },
      affected_population: 85000,
      recommendation: 'Monitor social media sentiment. Deploy acoustic sensors.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  alerts: [
    {
      id: '1',
      title: 'Critical: Multi-Signal Outbreak Detected',
      message: 'Multiple signal convergence in Mumbai indicates high probability outbreak event.',
      level: 'critical' as const,
      location: 'Mumbai, India',
      active: true,
      priority: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  signals: [
    {
      id: '1',
      type: 'wastewater' as const,
      location: 'Mumbai, India',
      coordinates: [72.8777, 19.0760] as [number, number],
      value: 75,
      metadata: { facility: 'Treatment Plant A', confidence: 0.9 },
      created_at: new Date().toISOString(),
    },
  ],
};
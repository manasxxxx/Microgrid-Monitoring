export interface ThingSpeakEntry {
  created_at: string;
  entry_id: number;
  field1?: string; // Solar generation
  field2?: string; // Wind generation  
  field3?: string; // Battery level
  field4?: string; // Consumption
  field5?: string; // Total generation
  field6?: string; // Voltage
  field7?: string; // Current
  field8?: string; // Additional field
}

export interface ThingSpeakChannel {
  channel: {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    field1: string;
    field2: string;
    field3: string;
    field4: string;
    field5: string;
    field6: string;
    field7: string;
    field8: string;
    created_at: string;
    updated_at: string;
    last_entry_id: number;
  };
  feeds: ThingSpeakEntry[];
}

export interface EnergyData {
  solarGeneration: number;
  windGeneration: number;
  batteryLevel: number;
  consumption: number;
  totalGeneration: number;
  voltage: number;
  current: number;
  timestamp: string;
}

class ThingSpeakService {
  private channelId: string;
  private readApiKey: string;
  private baseUrl = 'https://api.thingspeak.com';

  constructor(channelId: string, readApiKey: string = '') {
    this.channelId = channelId;
    this.readApiKey = readApiKey;
  }

  setCredentials(channelId: string, readApiKey: string = '') {
    this.channelId = channelId;
    this.readApiKey = readApiKey;
  }

  async getLatestData(): Promise<EnergyData | null> {
    try {
      const url = this.buildUrl('/channels', this.channelId, '/feeds/last.json');
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ThingSpeakEntry = await response.json();
      
      return this.parseEntry(data);
    } catch (error) {
      console.error('Error fetching ThingSpeak data:', error);
      return null;
    }
  }

  async getHistoricalData(results: number = 100): Promise<EnergyData[]> {
    try {
      const url = this.buildUrl('/channels', this.channelId, `/feeds.json?results=${results}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ThingSpeakChannel = await response.json();
      
      return data.feeds
        .map(entry => this.parseEntry(entry))
        .filter((entry): entry is EnergyData => entry !== null);
    } catch (error) {
      console.error('Error fetching ThingSpeak historical data:', error);
      return [];
    }
  }

  private parseEntry(entry: ThingSpeakEntry): EnergyData | null {
    if (!entry) return null;
    
    return {
      solarGeneration: parseFloat(entry.field1 || '0'),
      windGeneration: parseFloat(entry.field2 || '0'), 
      batteryLevel: parseFloat(entry.field3 || '0'),
      consumption: parseFloat(entry.field4 || '0'),
      totalGeneration: parseFloat(entry.field5 || '0'),
      voltage: parseFloat(entry.field6 || '48.0'),
      current: parseFloat(entry.field7 || '3.5'),
      timestamp: entry.created_at
    };
  }

  private buildUrl(...parts: string[]): string {
    let url = this.baseUrl + parts.join('');
    
    if (this.readApiKey) {
      url += `${url.includes('?') ? '&' : '?'}api_key=${this.readApiKey}`;
    }
    
    return url;
  }
}

export default ThingSpeakService;
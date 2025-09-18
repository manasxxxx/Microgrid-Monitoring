export interface ThingSpeakEntry {
  created_at: string;
  entry_id: number;
  field1?: string; // Current
  field2?: string; // Wind generation  
  field3?: string; // Voltage
  field4?: string; // Consumption
  field5?: string; // Dust
  field6?: string; // Temperature
  field7?: string; // Battery level
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
  gridGeneration: number; // from current (field1)
  gridVoltage: number;    // from voltage (field3)
  batteryLevel: number;
  temperature: number;    // from field6
  dust: number;           // from field5
  timestamp: string;
}

class ThingSpeakService {
  private channelId: string;
  private readApiKey: string;
  private baseUrl = 'https://api.thingspeak.com';

  // Read API key from Vite environment at build time if provided
  // import.meta.env is a Vite-specific object; use any to avoid TS errors
  private static getEnvReadKey(): string {
    try {
      return ((import.meta as any).VITE_THINGSPEAK_API_KEY || '').toString();
    } catch (e) {
      return '';
    }
  }

  constructor(channelId: string, readApiKey: string = ThingSpeakService.getEnvReadKey()) {
    this.channelId = channelId;
    this.readApiKey = readApiKey || ThingSpeakService.getEnvReadKey();
  }

  setCredentials(channelId: string, readApiKey: string = '') {
  this.channelId = channelId;
  this.readApiKey = readApiKey || ThingSpeakService.getEnvReadKey();
  }

  async getLatestData(): Promise<EnergyData | null> {
    try {
      const url = this.buildUrl('/channels', this.channelId, '/feeds/last.json');
      const response = await fetch(url);

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        const err: any = new Error(`ThingSpeak getLatestData failed: ${response.status} ${response.statusText}`);
        err.status = response.status;
        err.body = text;
        throw err;
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
        const text = await response.text().catch(() => '');
        const err: any = new Error(`ThingSpeak getHistoricalData failed: ${response.status} ${response.statusText}`);
        err.status = response.status;
        err.body = text;
        throw err;
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
      gridGeneration: Number(entry.field1 ?? 0), // current
      gridVoltage: Number(entry.field3 ?? 0),    // voltage
      batteryLevel: Number(entry.field7 ?? 0),
      temperature: Number(entry.field6 ?? 0),
      dust: Number(entry.field5 ?? 0),
      timestamp: entry.created_at
    };
  }

  private buildUrl(...parts: string[]): string {
    // Normalize parts and join with single slashes to avoid missing or duplicate slashes
    const normalized = parts
      .map(p => String(p))
      .filter(p => p.length > 0)
      .map(p => p.replace(/^\/+/, '').replace(/\/+$/, ''))
      .join('/');

    let url = this.baseUrl.replace(/\/+$/, '') + '/' + normalized;

    if (this.readApiKey) {
      url += `${url.includes('?') ? '&' : '?'}api_key=${encodeURIComponent(this.readApiKey)}`;
    }

    return url;
  }
}

export default ThingSpeakService;

// Convenience helpers for quick GET/READ operations outside of the class
export async function fetchChannelLastRaw(channelId: string, readApiKey: string = ''): Promise<any> {
  const base = 'https://api.thingspeak.com';
  const url = `${base}/channels/${encodeURIComponent(channelId)}/feeds/last.json${readApiKey ? `?api_key=${encodeURIComponent(readApiKey)}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err: any = new Error(`ThingSpeak last entry fetch failed: ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }
  return res.json();
}

export async function fetchChannelFeedsRaw(channelId: string, results: number = 100, readApiKey: string = ''): Promise<any> {
  const base = 'https://api.thingspeak.com';
  const query = `results=${Number(results)}`;
  const url = `${base}/channels/${encodeURIComponent(channelId)}/feeds.json?${query}${readApiKey ? `&api_key=${encodeURIComponent(readApiKey)}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err: any = new Error(`ThingSpeak feeds fetch failed: ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }
  return res.json();
}
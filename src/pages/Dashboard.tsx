import { useState, useEffect, useCallback } from "react";
import { Sun, Wind, Battery, Zap, Home, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import EnergyGauge from "@/components/EnergyGauge";
import ThingSpeakConfig from "@/components/ThingSpeakConfig";
import ThingSpeakService, { EnergyData, fetchChannelLastRaw, fetchChannelFeedsRaw } from "@/services/thingspeakService";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [energyData, setEnergyData] = useState<EnergyData>({
    gridGeneration: 0,
    gridVoltage: 0,
    batteryLevel: 0,
    temperature: 0,
    dust: 0,
    timestamp: new Date().toISOString(),
  });
  const [gridType, setGridType] = useState<string>(() => localStorage.getItem('selectedGrid') || 'solar');

  // Set background and title based on gridType
  let dashboardTitle = 'Microgrid Dashboard';
  let bgClass = 'bg-background';
  if (gridType === 'solar') {
    dashboardTitle = 'Solar Grid Dashboard';
    // Lighter pastel yellow-orange gradient with subtle texture
    bgClass = 'bg-[linear-gradient(135deg,_#fffef8_0%,_#fff9e6_50%,_#fff3cc_100%)] relative';
  } else if (gridType === 'wind') {
    dashboardTitle = 'Windmill Grid Dashboard';
    // Lighter pastel blue gradient with subtle texture
    bgClass = 'bg-[linear-gradient(135deg,_#f8fdff_0%,_#e6f7ff_50%,_#d6f0ff_100%)] relative';
  } else if (gridType === 'other') {
    dashboardTitle = 'Hybrid/Other Grid Dashboard';
    bgClass = 'bg-gradient-to-br from-gray-50 to-green-100';
  }
  const [thingSpeakService, setThingSpeakService] = useState<ThingSpeakService | null>(null);
  const [channelId, setChannelId] = useState<string>('');
  const [readApiKey, setReadApiKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [rawLast, setRawLast] = useState<any | null>(null);
  const [rawFeeds, setRawFeeds] = useState<any | null>(null);
  const [errorDetail, setErrorDetail] = useState<{message: string; status?: number; body?: string} | null>(null);
  const { toast } = useToast();

  const handleConfigChange = useCallback((cId: string, rKey: string) => {
    const service = new ThingSpeakService(cId, rKey);
    setThingSpeakService(service);
    setChannelId(cId);
    setReadApiKey(rKey);
    setIsConnected(true);
  }, []);

  const handleFetchRawLast = useCallback(async () => {
    if (!channelId) {
      toast({ title: 'No Channel', description: 'Please configure a ThingSpeak channel first', variant: 'destructive' });
      return;
    }

    try {
      const data = await fetchChannelLastRaw(channelId, readApiKey);
      setRawLast(data);
      toast({ title: 'Fetched', description: 'Last entry fetched successfully' });
    } catch (err) {
    console.error(err);
    const e: any = err;
    setErrorDetail({ message: e.message || 'Fetch error', status: e.status, body: e.body });
    toast({ title: 'Fetch Error', description: e.message || String(err), variant: 'destructive' });
    }
  }, [channelId, readApiKey, toast]);

  const handleFetchRawFeeds = useCallback(async () => {
    if (!channelId) {
      toast({ title: 'No Channel', description: 'Please configure a ThingSpeak channel first', variant: 'destructive' });
      return;
    }

    try {
      const data = await fetchChannelFeedsRaw(channelId, 100, readApiKey);
      setRawFeeds(data);
      toast({ title: 'Fetched', description: 'Feeds fetched successfully' });
    } catch (err) {
    console.error(err);
    const e: any = err;
    setErrorDetail({ message: e.message || 'Fetch error', status: e.status, body: e.body });
    toast({ title: 'Fetch Error', description: e.message || String(err), variant: 'destructive' });
    }
  }, [channelId, readApiKey, toast]);

  const fetchData = useCallback(async () => {
    if (!thingSpeakService) return;
    
    setIsLoading(true);
    try {
      const data = await thingSpeakService.getLatestData();
      if (data) {
        setEnergyData(data);
        setLastUpdated(new Date(data.timestamp).toLocaleTimeString());
      } else {
        // Fallback to demo data if no data available
        setEnergyData(prev => ({
          ...prev,
          solarGeneration: Math.floor(Math.random() * 500) + 200,
          windGeneration: Math.floor(Math.random() * 300) + 100,
          batteryLevel: Math.floor(Math.random() * 40) + 60,
          consumption: Math.floor(Math.random() * 200) + 150,
          totalGeneration: Math.floor(Math.random() * 800) + 300,
        }));
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      const e: any = error;
      setErrorDetail({ message: e.message || 'Unknown error', status: e.status, body: e.body });
      toast({
        title: "Connection Error",
        description: e.message || "Failed to fetch data from ThingSpeak.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [thingSpeakService, toast]);

  // Real-time data updates
  useEffect(() => {
    if (!thingSpeakService) return;

    // Fetch initial data
    fetchData();

    // Set up interval for regular updates
    const interval = setInterval(fetchData, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [thingSpeakService, fetchData]);

  const energyCards = [
    {
      title: "Grid Generation",
      value: `${energyData.gridGeneration} A`,
      icon: Zap,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Grid Voltage",
      value: `${energyData.gridVoltage} V`,
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className={`min-h-screen ${bgClass}`} style={{
      backgroundImage: gridType === 'solar'
        ? 'linear-gradient(135deg, #fffef8 0%, #fff9e6 50%, #fff3cc 100%), url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'1\' fill=\'%23fff3cc\' fill-opacity=\'0.12\'/%3E%3C/svg%3E")'
        : gridType === 'wind'
        ? 'linear-gradient(135deg, #f8fdff 0%, #e6f7ff 50%, #d6f0ff 100%), url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'1\' fill=\'%23e6f7ff\' fill-opacity=\'0.10\'/%3E%3C/svg%3E")'
        : undefined,
      backgroundRepeat: 'repeat',
    }}> 
      <div className="container mx-auto p-4 pb-20">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{dashboardTitle}</h1>
              <p className="text-muted-foreground">Real-time energy monitoring</p>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <WifiOff className="w-3 h-3" />
                  Demo Mode
                </Badge>
              )}
              {lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  Updated: {lastUpdated}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ThingSpeak Configuration */}
        <ThingSpeakConfig onConfigChange={handleConfigChange} />

        {/* Improved: Removed developer/raw API section for better usability */}

        {/* Battery Level Gauge */}
        <div className="mb-6">
          <EnergyGauge 
            value={energyData.batteryLevel} 
            title="Battery Level" 
            unit="%" 
          />
        </div>

        {/* Grid Generation & Voltage Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {energyCards.map((card, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center mb-3`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Temperature & Dust Card */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-3">
                <Sun className="w-6 h-6 text-orange-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Temperature</p>
                <p className="text-2xl font-bold text-foreground">{energyData.temperature} °C</p>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center mb-3">
                <Wind className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Dust</p>
                <p className="text-2xl font-bold text-foreground">{energyData.dust} ppm</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Battery Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="w-5 h-5" />
              Battery Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Charge Level</span>
                  <span className="text-sm font-medium">{energyData.batteryLevel}%</span>
                </div>
                <Progress value={energyData.batteryLevel} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Grid Voltage</p>
                  <p className="font-semibold">{energyData.gridVoltage.toFixed(1)}V</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Grid Generation</p>
                  <p className="font-semibold">{energyData.gridGeneration.toFixed(1)}A</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Dashboard;
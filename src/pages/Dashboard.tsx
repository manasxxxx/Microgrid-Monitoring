import { useState, useEffect, useCallback } from "react";
import { Sun, Wind, Battery, Zap, Home, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import EnergyGauge from "@/components/EnergyGauge";
import ThingSpeakConfig from "@/components/ThingSpeakConfig";
import ThingSpeakService, { EnergyData } from "@/services/thingspeakService";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [energyData, setEnergyData] = useState<EnergyData>({
    solarGeneration: 0,
    windGeneration: 0,
    batteryLevel: 0,
    consumption: 0,
    totalGeneration: 0,
    voltage: 48.0,
    current: 3.5,
    timestamp: new Date().toISOString(),
  });
  const [thingSpeakService, setThingSpeakService] = useState<ThingSpeakService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const { toast } = useToast();

  const handleConfigChange = useCallback((channelId: string, readApiKey: string) => {
    const service = new ThingSpeakService(channelId, readApiKey);
    setThingSpeakService(service);
    setIsConnected(true);
  }, []);

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
      toast({
        title: "Connection Error",
        description: "Failed to fetch data from ThingSpeak. Using cached data.",
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
      title: "Solar Generation",
      value: `${energyData.solarGeneration}W`,
      icon: Sun,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Wind Generation", 
      value: `${energyData.windGeneration}W`,
      icon: Wind,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Generation",
      value: `${energyData.totalGeneration}W`,
      icon: Zap,
      color: "text-green-600", 
      bgColor: "bg-green-50",
    },
    {
      title: "Consumption",
      value: `${energyData.consumption}W`,
      icon: Home,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 pb-20">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Microgrid Dashboard</h1>
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

        {/* Battery Level Gauge */}
        <div className="mb-6">
          <EnergyGauge 
            value={energyData.batteryLevel} 
            title="Battery Level" 
            unit="%" 
          />
        </div>

        {/* Energy Generation & Consumption Cards */}
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
                  <p className="text-muted-foreground">Voltage</p>
                  <p className="font-semibold">{energyData.voltage.toFixed(1)}V</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current</p>
                  <p className="font-semibold">{energyData.current.toFixed(1)}A</p>
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
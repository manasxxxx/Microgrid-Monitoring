import { useState, useEffect } from "react";
import { Lightbulb, Fan, Zap, Home, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";

interface Load {
  id: string;
  name: string;
  type: "light" | "fan" | "appliance" | "critical";
  status: boolean;
  power: number; // watts
  icon: any;
  description: string;
}

const Control = () => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Mock initial load states
    const initialLoads: Load[] = [
      {
        id: "1",
        name: "Main Lighting",
        type: "light",
        status: true,
        power: 45,
        icon: Lightbulb,
        description: "Kitchen and living area lights"
      },
      {
        id: "2", 
        name: "Ceiling Fan",
        type: "fan",
        status: false,
        power: 75,
        icon: Fan,
        description: "Bedroom ceiling fan"
      },
      {
        id: "3",
        name: "Water Pump",
        type: "critical",
        status: true,
        power: 150,
        icon: Zap,
        description: "Main water supply pump"
      },
      {
        id: "4",
        name: "Outdoor Lights",
        type: "light",
        status: false,
        power: 30,
        icon: Lightbulb,
        description: "Garden and pathway lighting"
      },
      {
        id: "5",
        name: "Workshop Tools",
        type: "appliance",
        status: false,
        power: 200,
        icon: Home,
        description: "Power tools and equipment"
      },
    ];
    
    setLoads(initialLoads);

    // Simulate connection status
    const connectionInterval = setInterval(() => {
      setIsOnline(Math.random() > 0.1); // 90% uptime simulation
    }, 5000);

    return () => clearInterval(connectionInterval);
  }, []);

  const toggleLoad = async (loadId: string) => {
    const load = loads.find(l => l.id === loadId);
    if (!load) return;

    // Simulate API call delay
    const newStatus = !load.status;
    
    setLoads(prev => 
      prev.map(l => 
        l.id === loadId 
          ? { ...l, status: newStatus }
          : l
      )
    );

    // Simulate Firebase update
    setTimeout(() => {
      toast({
        title: `${load.name} ${newStatus ? 'Enabled' : 'Disabled'}`,
        description: `Load control updated successfully`,
      });
    }, 500);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "light":
        return "bg-yellow-100 text-yellow-800";
      case "fan":
        return "bg-blue-100 text-blue-800";
      case "appliance":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalActivePower = loads
    .filter(load => load.status)
    .reduce((sum, load) => sum + load.power, 0);

  const activeLoads = loads.filter(load => load.status).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 pb-20">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-foreground">Load Control</h1>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-600" />
              )}
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            {activeLoads} active load{activeLoads !== 1 ? 's' : ''} • {totalActivePower}W total consumption
          </p>
        </div>

        {/* System Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Active Loads</p>
                <p className="text-xl font-semibold">{activeLoads}/{loads.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Power</p>
                <p className="text-xl font-semibold">{totalActivePower}W</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Load Controls */}
        <div className="space-y-4">
          {loads.map((load) => {
            const IconComponent = load.icon;
            
            return (
              <Card key={load.id} className="transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        load.status 
                          ? "bg-primary/10 text-primary" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground truncate">{load.name}</h3>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getTypeColor(load.type)}`}
                          >
                            {load.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {load.description} • {load.power}W
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            load.status ? "bg-green-500" : "bg-gray-400"
                          }`} />
                          <span className="text-xs text-muted-foreground">
                            {load.status ? "ON" : "OFF"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={load.status}
                      onCheckedChange={() => toggleLoad(load.id)}
                      disabled={!isOnline}
                      className="ml-4"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {!isOnline && (
          <Card className="mt-6 border-destructive/50 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Connection lost. Load controls are disabled until connection is restored.
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Navigation />
    </div>
  );
};

export default Control;
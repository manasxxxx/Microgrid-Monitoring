import { useState, useEffect } from "react";
import { Sun, Wind, Battery, Zap, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import EnergyGauge from "@/components/EnergyGauge";

const Dashboard = () => {
  const [energyData, setEnergyData] = useState({
    solarGeneration: 0,
    windGeneration: 0,
    batteryLevel: 0,
    consumption: 0,
    totalGeneration: 0,
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyData({
        solarGeneration: Math.floor(Math.random() * 500) + 200,
        windGeneration: Math.floor(Math.random() * 300) + 100,
        batteryLevel: Math.floor(Math.random() * 40) + 60,
        consumption: Math.floor(Math.random() * 200) + 150,
        totalGeneration: Math.floor(Math.random() * 800) + 300,
      });
    }, 3000);

    // Initial load
    setEnergyData({
      solarGeneration: 324,
      windGeneration: 156,
      batteryLevel: 78,
      consumption: 180,
      totalGeneration: 480,
    });

    return () => clearInterval(interval);
  }, []);

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
          <h1 className="text-2xl font-bold text-foreground">Microgrid Dashboard</h1>
          <p className="text-muted-foreground">Real-time energy monitoring</p>
        </div>

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
                  <p className="font-semibold">48.2V</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current</p>
                  <p className="font-semibold">3.7A</p>
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
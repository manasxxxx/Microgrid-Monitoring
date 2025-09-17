import { useState, useEffect } from "react";
import { AlertTriangle, Battery, Wrench, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

interface Alert {
  id: string;
  type: "warning" | "error" | "info";
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Simulate fetching alerts from Firebase
    const mockAlerts: Alert[] = [
      {
        id: "1",
        type: "warning",
        title: "Low Battery Level",
        description: "Battery charge has dropped to 15%. Consider reducing load or check solar panels.",
        timestamp: "2024-01-15 14:30",
        acknowledged: false,
      },
      {
        id: "2",
        type: "error",
        title: "Solar Panel Cleaning Required",
        description: "Solar panel efficiency has decreased by 30%. Cleaning recommended.",
        timestamp: "2024-01-15 12:15",
        acknowledged: false,
      },
      {
        id: "3",
        type: "info",
        title: "Maintenance Scheduled",
        description: "Regular maintenance check is due for wind turbine on January 20th.",
        timestamp: "2024-01-14 09:00",
        acknowledged: true,
      },
      {
        id: "4",
        type: "warning",
        title: "High Load Consumption",
        description: "Current consumption is 95% of generation capacity.",
        timestamp: "2024-01-14 16:45",
        acknowledged: true,
      },
    ];
    
    setAlerts(mockAlerts);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "info":
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "error":
        return <Badge variant="destructive">Critical</Badge>;
      case "info":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const toggleAcknowledge = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: !alert.acknowledged }
          : alert
      )
    );
  };

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">System Alerts</h1>
          <p className="text-muted-foreground">
            {unacknowledgedCount > 0 
              ? `${unacknowledgedCount} new alert${unacknowledgedCount > 1 ? 's' : ''} require attention`
              : "All alerts have been acknowledged"
            }
          </p>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`cursor-pointer transition-all ${
                !alert.acknowledged ? "border-l-4 border-l-primary" : "opacity-75"
              }`}
              onClick={() => toggleAcknowledge(alert.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.type)}
                    <CardTitle className="text-base">{alert.title}</CardTitle>
                    {alert.acknowledged && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                  {getAlertBadge(alert.type)}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-2">
                  {alert.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{alert.timestamp}</span>
                  <span>
                    {alert.acknowledged ? "Acknowledged" : "Tap to acknowledge"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {alerts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Alerts</h3>
              <p className="text-muted-foreground">
                Your microgrid is operating normally. All systems are functioning as expected.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Navigation />
    </div>
  );
};

export default Alerts;

import { useState, useEffect } from "react";
import { AlertTriangle, Battery, Wrench, CheckCircle, Clock, Calendar as CalendarIcon, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

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
  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [activityTitle, setActivityTitle] = useState("");

  useEffect(() => {
    // Simulate fetching alerts from Firebase
    const mockAlerts: Alert[] = [
      // ...existing mock alerts...
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
        timestamp: "2024-01-20 09:00",
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
    // Only keep alerts with today or future dates
    const today = new Date();
    today.setHours(0,0,0,0);
    const filtered = mockAlerts.filter(a => {
      const date = new Date(a.timestamp.split(" ")[0]);
      date.setHours(0,0,0,0);
      return date >= today;
    });
    setAlerts(filtered);
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


  // --- Calendar logic ---
  // Find all maintenance events (scheduled or user-created)
  const maintenanceEvents = alerts.filter(a =>
    (a.title.toLowerCase().includes("maintenance") || a.description.toLowerCase().includes("maintenance"))
  ).map(a => {
    // Try to parse date from timestamp (YYYY-MM-DD or similar)
    const date = a.timestamp ? new Date(a.timestamp.split(" ")[0]) : undefined;
    return date ? { ...a, date } : null;
  }).filter(e => {
    // Only keep events with today or future dates
    if (!e) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    e.date.setHours(0,0,0,0);
    return e.date >= today;
  }) as (Alert & { date: Date })[];

  // Dates with maintenance
  const maintenanceDates = maintenanceEvents.map(e => e.date.toDateString());

  // Add new maintenance event
  const handleSchedule = () => {
    if (!selectedDate || !activityTitle.trim()) return;
    const newAlert: Alert = {
      id: Date.now().toString(),
      type: "info",
      title: activityTitle,
      description: `User scheduled: ${activityTitle}`,
      timestamp: `${selectedDate.toISOString().split("T")[0]} 09:00`,
      acknowledged: false,
    };
    setAlerts(prev => [...prev, newAlert]);
    setShowScheduleModal(false);
    setActivityTitle("");
    setSelectedDate(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 pb-20">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <CalendarIcon className="w-6 h-6" /> System Alerts & Maintenance
            </h1>
            <p className="text-muted-foreground">
              {unacknowledgedCount > 0 
                ? `${unacknowledgedCount} new alert${unacknowledgedCount > 1 ? 's' : ''} require attention`
                : "All alerts have been acknowledged"}
            </p>

          </div>
          <div className="flex flex-col items-end gap-2">
            <Button variant="outline" onClick={() => setShowScheduleModal(true)}>
              <Plus className="w-4 h-4 mr-1" /> Plan Maintenance/Activity
            </Button>
          </div>
        </div>

        {/* Calendar View */}
        <div className="mb-8 flex justify-center items-center w-full min-h-[80vh]">
          <div className="bg-white/90 rounded-2xl shadow-2xl border border-blue-200 p-6 w-full max-w-3xl flex flex-col items-center min-h-[70vh]">
            <div className="font-bold text-xl mb-4 flex items-center gap-2 text-blue-800">
              <CalendarIcon className="w-6 h-6" /> Maintenance Calendar
            </div>
            <div className="flex-1 w-full flex items-center justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  maintenance: (date: Date) => maintenanceDates.includes(date.toDateString()),
                }}
                modifiersClassNames={{
                  maintenance: "bg-blue-200 text-blue-900 font-bold border-2 border-blue-500 shadow-inner",
                }}
                className="max-w-2xl h-full"
                footer={selectedDate && (
                  <div className="mt-4 flex flex-col gap-2 items-center">
                    <span className="font-medium text-blue-700">Selected: {selectedDate.toDateString()}</span>
                    <Button size="lg" className="w-64" onClick={() => setShowScheduleModal(true)}>
                      <Plus className="w-5 h-5 mr-2" /> Schedule Maintenance/Activity
                    </Button>
                  </div>
                )}
              />
            </div>
          </div>
          {/* List scheduled maintenances for selected date (only if any) */}
          {selectedDate && maintenanceEvents.filter(e => e.date.toDateString() === selectedDate.toDateString()).length > 0 && (
            <div className="mt-4">
              <div className="font-medium mb-1 text-blue-800">Scheduled Activities on {selectedDate.toDateString()}:</div>
              <ul className="list-disc ml-6">
                {maintenanceEvents.filter(e => e.date.toDateString() === selectedDate.toDateString()).map(e => (
                  <li key={e.id} className="text-sm font-medium text-blue-900">{e.title} <span className="text-xs text-muted-foreground">({e.timestamp})</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* List View (existing) */}
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`cursor-pointer transition-all ${!alert.acknowledged ? "border-l-4 border-l-primary" : "opacity-75"}`}
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

      {/* Modal for scheduling new maintenance/activity */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Schedule Maintenance/Activity</h2>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={selectedDate ? selectedDate.toDateString() : ""}
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Activity Title</label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={activityTitle}
                onChange={e => setActivityTitle(e.target.value)}
                placeholder="e.g. Maintenance, Cleaning, Inspection"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
              <Button onClick={handleSchedule} disabled={!activityTitle.trim()}>Schedule</Button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
};

export default Alerts;
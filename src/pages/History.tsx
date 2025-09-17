import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";

const History = () => {
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

  // Mock historical data
  const dailyData = [
    { time: "00:00", generation: 0, consumption: 120, battery: 85 },
    { time: "06:00", generation: 150, consumption: 180, battery: 78 },
    { time: "09:00", generation: 380, consumption: 220, battery: 82 },
    { time: "12:00", generation: 520, consumption: 280, battery: 89 },
    { time: "15:00", generation: 480, consumption: 250, battery: 92 },
    { time: "18:00", generation: 200, consumption: 320, battery: 86 },
    { time: "21:00", generation: 50, consumption: 180, battery: 81 },
  ];

  const weeklyData = [
    { day: "Mon", generation: 4200, consumption: 3800, efficiency: 91 },
    { day: "Tue", generation: 3900, consumption: 4100, efficiency: 88 },
    { day: "Wed", generation: 4500, consumption: 3600, efficiency: 94 },
    { day: "Thu", generation: 4100, consumption: 3900, efficiency: 90 },
    { day: "Fri", generation: 3800, consumption: 4200, efficiency: 86 },
    { day: "Sat", generation: 4600, consumption: 3400, efficiency: 96 },
    { day: "Sun", generation: 4300, consumption: 3700, efficiency: 93 },
  ];

  const currentData = viewMode === "daily" ? dailyData : weeklyData;

  const totalGeneration = viewMode === "daily" 
    ? dailyData.reduce((sum, item) => sum + item.generation, 0)
    : weeklyData.reduce((sum, item) => sum + item.generation, 0);

  const totalConsumption = viewMode === "daily"
    ? dailyData.reduce((sum, item) => sum + item.consumption, 0)
    : weeklyData.reduce((sum, item) => sum + item.consumption, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Energy History</h1>
          <p className="text-muted-foreground">Historical energy data and trends</p>
        </div>

        {/* Time Period Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={viewMode === "daily" ? "default" : "outline"}
            onClick={() => setViewMode("daily")}
            size="sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Daily
          </Button>
          <Button
            variant={viewMode === "weekly" ? "default" : "outline"}
            onClick={() => setViewMode("weekly")}
            size="sm"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Weekly
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Generated</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(totalGeneration / (viewMode === "daily" ? 1 : 1000))}
                  {viewMode === "daily" ? "Wh" : "kWh"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Consumed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(totalConsumption / (viewMode === "daily" ? 1 : 1000))}
                  {viewMode === "daily" ? "Wh" : "kWh"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Energy Generation & Consumption Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {viewMode === "daily" ? "Today's" : "This Week's"} Energy Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {viewMode === "daily" ? (
                  <LineChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="generation" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      name="Generation (W)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="consumption" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Consumption (W)"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="generation" fill="#22c55e" name="Generation (Wh)" />
                    <Bar dataKey="consumption" fill="#3b82f6" name="Consumption (Wh)" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Battery Level Chart (Daily only) */}
        {viewMode === "daily" && (
          <Card>
            <CardHeader>
              <CardTitle>Battery Level Throughout Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="battery" 
                      stroke="#eab308" 
                      strokeWidth={3}
                      name="Battery Level (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Efficiency Chart (Weekly only) */}
        {viewMode === "weekly" && (
          <Card>
            <CardHeader>
              <CardTitle>System Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis domain={[80, 100]} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="efficiency" fill="#8b5cf6" name="Efficiency %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Navigation />
    </div>
  );
};

export default History;
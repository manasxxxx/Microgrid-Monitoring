import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import ThingSpeakService from "@/services/thingspeakService";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";

const History = () => {
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

  // Real data state
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  // Date range selection
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({start: '', end: ''});

  // Fetch data on mount and when dateRange changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const channelId = "3079847";
      const apiKey = "G6B2JZLXCM9IVD5J";
      const service = new ThingSpeakService(channelId, apiKey);
      let data = [];
      if (!dateRange.start || !dateRange.end) {
        data = await service.getHistoricalData(7);
      } else {
        const maxResults = 100;
        const allData = await service.getHistoricalData(maxResults);
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        data = allData.filter((d: any) => {
          const t = new Date(d.timestamp);
          return t >= start && t <= end;
        });
      }
      // Map to chart format
      const mapped = data.map((d: any) => ({
        time: d.timestamp ? new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        voltage: d.gridVoltage,
        current: d.gridGeneration,
        temperature: d.temperature,
        dust: d.dust,
        battery: d.batteryLevel
      }));
      setDailyData(mapped);
      setLoading(false);
    };
    fetchData();
  }, [dateRange.start, dateRange.end]);

  // Advanced anomaly detection (z-score for temperature and dust)
  function getAnomalies(data: any[], key: string, threshold = 2) {
    if (!data.length) return [];
    const values = data.map(d => d[key]);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const std = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / values.length);
    return data.map((d, i) => {
      const z = std === 0 ? 0 : (d[key] - mean) / std;
      return Math.abs(z) > threshold;
    });
  }
  const tempAnomalies = getAnomalies(dailyData, 'temperature');
  const dustAnomalies = getAnomalies(dailyData, 'dust');

  // CSV download
  const handleDownloadCSV = () => {
    if (!dailyData.length) return;
    const header = Object.keys(dailyData[0]).join(',');
    const rows = dailyData.map(row => Object.values(row).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'energy-history.csv');
  };

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

  // For dailyData, generation/consumption are not present; only weeklyData has them
  const totalGeneration = viewMode === "daily" 
    ? 0
    : weeklyData.reduce((sum, item) => sum + item.generation, 0);

  const totalConsumption = viewMode === "daily"
    ? 0
    : weeklyData.reduce((sum, item) => sum + item.consumption, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Energy History</h1>
          <p className="text-muted-foreground">Historical energy data and trends</p>
        </div>

        {/* Date/Time Range & Download */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex gap-2">
            <input type="date" className="border rounded px-2 py-1" value={dateRange.start} onChange={e => setDateRange(r => ({...r, start: e.target.value}))} />
            <span className="mx-1">to</span>
            <input type="date" className="border rounded px-2 py-1" value={dateRange.end} onChange={e => setDateRange(r => ({...r, end: e.target.value}))} />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownloadCSV} variant="outline" size="sm">Download CSV</Button>
          </div>
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

        {/* Multi-metric Trends Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Today's Trends (Voltage, Current, Temp, Dust, Battery)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="voltage" stroke="#3b82f6" strokeWidth={2} name="Voltage (V)" />
                  <Line yAxisId="left" type="monotone" dataKey="current" stroke="#22c55e" strokeWidth={2} name="Current (A)" />
                  <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#f59e42" strokeWidth={2} name="Temp (°C)" />
                  <Line yAxisId="right" type="monotone" dataKey="dust" stroke="#a78bfa" strokeWidth={2} name="Dust" />
                  <Line yAxisId="right" type="monotone" dataKey="battery" stroke="#eab308" strokeWidth={2} name="Battery (%)" />
                  {/* Highlight unusual patterns: e.g., if dust > 18 or temp > 28 */}
                  {dailyData.map((d, i) => (
                    (tempAnomalies[i] || dustAnomalies[i]) ? (
                      <circle key={i} cx={i * 100 / (dailyData.length-1) + '%'} cy="10" r="6" fill="#f87171" opacity="0.7" />
                    ) : null
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-red-500 mt-2">
              <span className="font-bold">Note:</span> Red dots highlight statistical anomalies in dust or temperature (z-score {'>'} 2).
            </div>
          </CardContent>
        </Card>

        {/* Battery Level Chart (Daily only) */}
  {viewMode === "daily" && !loading && dailyData.length > 0 && (
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Battery, Home, Sun, Zap } from "lucide-react";

// Simple animated energy flow (not a true Sankey, but visually clear)
const EnergyFlow = ({ solar, battery, grid, load }: { solar: number; battery: number; grid: number; load: number }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
          Energy Flow Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <Sun className="w-8 h-8 text-yellow-400" />
              <span className="text-xs mt-1">Solar</span>
              <span className="font-bold text-sm">{solar} W</span>
            </div>
            <ArrowRight className="w-8 h-8 text-yellow-400 animate-bounce-x" />
            <div className="flex flex-col items-center">
              <Battery className="w-8 h-8 text-green-500" />
              <span className="text-xs mt-1">Battery</span>
              <span className="font-bold text-sm">{battery} %</span>
            </div>
            <ArrowRight className="w-8 h-8 text-blue-400 animate-bounce-x" />
            <div className="flex flex-col items-center">
              <Zap className="w-8 h-8 text-blue-500" />
              <span className="text-xs mt-1">Grid</span>
              <span className="font-bold text-sm">{grid} V</span>
            </div>
            <ArrowRight className="w-8 h-8 text-purple-400 animate-bounce-x" />
            <div className="flex flex-col items-center">
              <Home className="w-8 h-8 text-purple-500" />
              <span className="text-xs mt-1">Load</span>
              <span className="font-bold text-sm">{load} W</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyFlow;

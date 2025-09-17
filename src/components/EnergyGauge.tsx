import { Card, CardContent } from "@/components/ui/card";

interface EnergyGaugeProps {
  value: number;
  title: string;
  unit: string;
  max?: number;
}

const EnergyGauge = ({ value, title, unit, max = 100 }: EnergyGaugeProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (percentage: number) => {
    if (percentage >= 70) return "#22c55e"; // green
    if (percentage >= 40) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <div className="relative w-32 h-32">
            <svg
              className="transform -rotate-90 w-32 h-32"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={getColor(percentage)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-in-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{value}</span>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyGauge;
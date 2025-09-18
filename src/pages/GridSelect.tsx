import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sun, Wind, Layers } from "lucide-react";

const gridOptions = [
  {
    label: "Solar Grid",
  icon: Sun,
    value: "solar",
    description: "Monitor your solar power system."
  },
  {
    label: "Windmill Grid",
    icon: Wind,
    value: "wind",
    description: "Monitor your wind energy system."
  },
  {
    label: "Other Grid",
    icon: Layers,
    value: "other",
    description: "Monitor other or hybrid grid systems."
  }
];

const GridSelect = () => {
  const navigate = useNavigate();

  const handleSelect = (value: string) => {
    localStorage.setItem('selectedGrid', value);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-8 text-center">Select Your Grid</h2>
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {gridOptions.map((option) => (
          <Card key={option.value} className="hover:shadow-xl transition-shadow cursor-pointer min-h-[320px] flex flex-col justify-between">
            <CardHeader className="flex flex-col items-center gap-4 pb-2">
              <option.icon className="w-16 h-16 text-primary mb-2" />
              <CardTitle className="text-xl font-bold text-center">{option.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2 flex-1 justify-end">
              <p className="text-base text-muted-foreground text-center mb-6">{option.description}</p>
              <Button onClick={() => handleSelect(option.value)} className="w-full h-12 text-lg">Select</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GridSelect;

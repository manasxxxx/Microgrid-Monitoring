
import { useNavigate } from "react-router-dom";
import { Sun, Wind, Battery, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="flex justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Sun className="w-8 h-8 text-orange-600" />
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Wind className="w-8 h-8 text-blue-600" />
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Battery className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Microgrid Monitor</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Monitor and control your rural solar and wind energy system
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/login")}
            className="w-full h-12 text-lg"
            size="lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

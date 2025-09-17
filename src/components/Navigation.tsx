import { useLocation, useNavigate } from "react-router-dom";
import { Home, AlertTriangle, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, path: "/dashboard", label: "Dashboard" },
    { icon: AlertTriangle, path: "/alerts", label: "Alerts" },
    { icon: BarChart3, path: "/history", label: "History" },
    { icon: Settings, path: "/control", label: "Control" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ icon: Icon, path, label }) => (
          <Button
            key={path}
            variant="ghost"
            size="sm"
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-4 ${
              location.pathname === path 
                ? "text-primary" 
                : "text-muted-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ThingSpeakConfigProps {
  onConfigChange: (channelId: string, readApiKey: string) => void;
}

const ThingSpeakConfig = ({ onConfigChange }: ThingSpeakConfigProps) => {
  useEffect(() => {
    // Hardcoded credentials
    onConfigChange('3079847', 'G6B2JZLXCM9IVD5J');
  }, [onConfigChange]);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Connected to Channel: 3079847
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThingSpeakConfig;

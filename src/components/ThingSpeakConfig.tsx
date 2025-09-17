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
  const [channelId, setChannelId] = useState('');
  const [readApiKey, setReadApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved configuration
    const savedChannelId = localStorage.getItem('thingspeak_channel_id');
    const savedReadApiKey = localStorage.getItem('thingspeak_read_api_key');
    
    if (savedChannelId) {
      setChannelId(savedChannelId);
      setReadApiKey(savedReadApiKey || '');
      setIsConfigured(true);
      onConfigChange(savedChannelId, savedReadApiKey || '');
    }
  }, [onConfigChange]);

  const handleSave = () => {
    if (!channelId.trim()) {
      toast({
        title: "Error",
        description: "Channel ID is required",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem('thingspeak_channel_id', channelId.trim());
    localStorage.setItem('thingspeak_read_api_key', readApiKey.trim());
    
    setIsConfigured(true);
    onConfigChange(channelId.trim(), readApiKey.trim());
    
    toast({
      title: "Success",
      description: "ThingSpeak configuration saved",
    });
  };

  const handleReset = () => {
    localStorage.removeItem('thingspeak_channel_id');
    localStorage.removeItem('thingspeak_read_api_key');
    setChannelId('');
    setReadApiKey('');
    setIsConfigured(false);
  };

  if (isConfigured) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Connected to Channel: {channelId}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
            >
              Change
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-orange-200 bg-orange-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5" />
          Configure ThingSpeak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="channelId">Channel ID *</Label>
          <Input
            id="channelId"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="Enter your ThingSpeak channel ID"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="readApiKey">Read API Key (optional)</Label>
          <Input
            id="readApiKey"
            value={readApiKey}
            onChange={(e) => setReadApiKey(e.target.value)}
            placeholder="Enter read API key for private channels"
          />
          <p className="text-xs text-muted-foreground">
            Only required for private channels
          </p>
        </div>
        
        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
};

export default ThingSpeakConfig;
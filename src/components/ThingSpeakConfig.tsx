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
  const [channelId, setChannelId] = useState<string>(() => localStorage.getItem('thingspeak_channel') || '3079847');
  const [readKey, setReadKey] = useState<string>(() => localStorage.getItem('thingspeak_read_key') || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Initialize with stored or default channel on mount
    onConfigChange(channelId, readKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    setSaving(true);
    try {
      localStorage.setItem('thingspeak_channel', channelId);
      localStorage.setItem('thingspeak_read_key', readKey);
      onConfigChange(channelId, readKey);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          ThingSpeak Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
        <div className="col-span-1 md:col-span-1">
          <Label htmlFor="channel">Channel ID</Label>
          <Input id="channel" value={channelId} onChange={(e) => setChannelId(e.target.value)} />
        </div>
        <div className="col-span-1 md:col-span-1">
          <Label htmlFor="readKey">Read API Key (optional)</Label>
          <Input id="readKey" value={readKey} onChange={(e) => setReadKey(e.target.value)} />
        </div>
        <div className="col-span-1 md:col-span-1">
          <Button onClick={handleSave} disabled={saving} className="w-full">
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThingSpeakConfig;

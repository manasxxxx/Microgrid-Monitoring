import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.78afa3ed925946c5813414b71141a9c8',
  appName: 'Microgrid Monitor',
  webDir: 'dist',
  server: {
    url: 'https://78afa3ed-9259-46c5-8134-14b71141a9c8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
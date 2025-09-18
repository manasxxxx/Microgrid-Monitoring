import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.microgrid.monitor',
  appName: 'Microgrid Monitor',
  webDir: 'dist',
  server: {
    // url removed (was Lovable-specific)
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
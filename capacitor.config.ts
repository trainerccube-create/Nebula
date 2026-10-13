import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.playstore.nebulatroll',
  appName: 'Nebula Troll Escape',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;

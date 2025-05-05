import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'bookingApp',
  webDir: 'www',
  plugins: {
    SplashScreen: {
       launchShowDuration: 5000,
       launchAutoHide: true,
       backgroundColor: '#ffffff',
       androidSplashResourceName: 'splash',
       splashFullScreen: true,
       splashImmersive: true,
      },
    },
  }

export default config;


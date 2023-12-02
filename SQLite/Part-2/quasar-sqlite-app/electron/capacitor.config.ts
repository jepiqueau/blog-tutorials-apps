import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jeepq.quasar.sqlite',
  appName: 'quasar-sqlite-app',
  webDir: 'dist/spa',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: false,
      iosKeychainPrefix: 'ionic7-vue-sqlite-app',
      androidIsEncryption: false,
      electronIsEncryption: false,
      electronWindowsLocation: 'C:\\ProgramData\\CapacitorDatabases',
      electronMacLocation:
        '/Volumes/Development_Lacie/Development/CapacitorDatabases',
      electronLinuxLocation: 'Databases',
    },
  },
};

export default config;

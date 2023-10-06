import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.jeep.sqlite.vue.encryption',
  appName: 'ionic7-vue-sqlite-app-encryption',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorSQLite: {
    iosDatabaseLocation: 'Library/CapacitorDatabase',
    iosIsEncryption: true,
    iosKeychainPrefix: 'ionic7-vue-sqlite-app-encryption',
    iosBiometric: {
        biometricAuth: false,
        biometricTitle : "Biometric login for capacitor sqlite"
    },
    androidIsEncryption: true,
    androidBiometric: {
        biometricAuth : false,
        biometricTitle : "Biometric login for capacitor sqlite",
        biometricSubTitle : "Log in using your biometric"
    },
    electronIsEncryption: true,
    electronWindowsLocation: "C:\\ProgramData\\CapacitorDatabases",
    electronMacLocation: "/Volumes/Development_Lacie/Development/Databases/ionic7-vue-sqlite-app",
    electronLinuxLocation: "Databases"
    }
  }
};

export default config;

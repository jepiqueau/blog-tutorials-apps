import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ionic7-angular-sqlite-app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
      CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: false,
      iosKeychainPrefix: 'ionic7-angular-sqlite-app',
      iosBiometric: {
          biometricAuth: false,
          biometricTitle : "Biometric login for capacitor sqlite"
      },
      androidIsEncryption: false,
      androidBiometric: {
          biometricAuth : false,
          biometricTitle : "Biometric login for capacitor sqlite",
          biometricSubTitle : "Log in using your biometric"
      },
      electronIsEncryption: false,
      electronWindowsLocation: "C:\\ProgramData\\CapacitorDatabases",
      electronMacLocation: "/Volumes/Development_Lacie/Development/Databases",
      electronLinuxLocation: "Databases"
      }
  }
};

export default config;

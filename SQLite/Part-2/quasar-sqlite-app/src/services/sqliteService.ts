import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
  capSQLiteUpgradeOptions,
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

export interface ISQLiteService {
  addUpgradeStatement(options: capSQLiteUpgradeOptions): Promise<void>;
  closeDatabase(dbName: string, readOnly: boolean): Promise<void>;
  getPlatform(): string;
  initWebStore(): Promise<void>;
  isConnection(dbName: string, readOnly: boolean): Promise<boolean>;
  openDatabase(
    dbName: string,
    loadToVersion: number,
    readOnly: boolean
  ): Promise<SQLiteDBConnection | undefined>;
  saveToStore(dbName: string): Promise<void>;
  saveToLocalDisk(dbName: string): Promise<void>;
}

class SQLiteService implements ISQLiteService {
  platform = Capacitor.getPlatform();
  sqlitePlugin = CapacitorSQLite;
  sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  dbNameVersionDict: Map<string, number> = new Map();

  async addUpgradeStatement(options: capSQLiteUpgradeOptions): Promise<void> {
    // add the upgrade statement to define the database schema
    // depending on the database version
    try {
      await this.sqlitePlugin.addUpgradeStatement(options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const msg = error.message ? error.message : error;
      throw new Error(`sqliteService.addUpgradeStatement: ${msg}`);
    }
    return;
  }

  async closeDatabase(dbName: string, readOnly: boolean): Promise<void> {
    // close the connection to the database and close the database
    try {
      const isConn = (
        await this.sqliteConnection.isConnection(dbName, readOnly)
      ).result;
      if (isConn) {
        await this.sqliteConnection.closeConnection(dbName, readOnly);
      }
      return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const msg = error.message ? error.message : error;
      throw new Error(`sqliteService.closeDatabase: ${msg}`);
    }
  }

  getPlatform(): string {
    // return the device platform
    return this.platform;
  }

  async initWebStore(): Promise<void> {
    // initialize the web store to store the database for web platform
    try {
      await this.sqliteConnection.initWebStore();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const msg = error.message ? error.message : error;
      throw new Error(`sqliteService.initWebStore: ${msg}`);
    }
    return;
  }
  async isConnection(dbName: string, readOnly: boolean): Promise<boolean> {
    // check if a connection exist to the database
    try {
      const isConn = (
        await this.sqliteConnection.isConnection(dbName, readOnly)
      ).result;
      if (isConn != undefined) {
        return isConn;
      } else {
        throw new Error('sqliteService.isConnection undefined');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const msg: string = error.message ? error.message : error;
      throw new Error(`sqliteService.isConnection: ${msg}`);
    }
  }

  async openDatabase(
    dbName: string,
    loadToVersion: number,
    readOnly: boolean
  ): Promise<SQLiteDBConnection | undefined> {
    // create a database connection and open the database
    this.dbNameVersionDict.set(dbName, loadToVersion);
    const encrypted = false;
    const mode = encrypted ? 'secret' : 'no-encryption';
    try {
      let db: SQLiteDBConnection;
      const retCC = (await this.sqliteConnection.checkConnectionsConsistency())
        .result;
      const isConn = (
        await this.sqliteConnection.isConnection(dbName, readOnly)
      ).result;
      if (retCC && isConn) {
        db = await this.sqliteConnection.retrieveConnection(dbName, readOnly);
      } else {
        db = await this.sqliteConnection.createConnection(
          dbName,
          encrypted,
          mode,
          loadToVersion,
          readOnly
        );
      }
      await db.open();
      const res = await db.isDBOpen();
      if (!res.result) {
        const msg = 'database is not opened';
        throw new Error(`sqliteService.openDatabase: ${msg}`);
      }
      return db;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const msg = error.message ? error.message : error;
      throw new Error(`sqliteService.openDatabase: ${msg}`);
    }
  }

  async saveToLocalDisk(dbName: string): Promise<void> {
    // save the database to local disk for the Web platform
    try {
      await this.sqliteConnection.saveToLocalDisk(dbName);
      return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err.message ? err.message : err;
      throw new Error(`sqliteService.saveToLocalDisk: ${msg}`);
    }
  }

  async saveToStore(dbName: string): Promise<void> {
    // save the database to store for the Web platform
    try {
      await this.sqliteConnection.saveToStore(dbName);
      return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const msg = error.message ? error.message : error;
      throw new Error(`sqliteService.saveToStore: ${msg}`);
    }
  }
}
export default SQLiteService;

import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection, CapacitorSQLitePlugin,
  capSQLiteUpgradeOptions, capSQLiteResult, capSQLiteValues} from '@capacitor-community/sqlite';

@Injectable()

export class SQLiteService {
  sqliteConnection!: SQLiteConnection;
  isService: boolean = false;
  platform!: string;
  sqlitePlugin!: CapacitorSQLitePlugin;
  native: boolean = false;
  constructor() {
  }
  /**
   * Plugin Initialization
   */
  async initializePlugin(): Promise<boolean> {
        this.platform = Capacitor.getPlatform();
        if(this.platform === 'ios' || this.platform === 'android') this.native = true;
        this.sqlitePlugin = CapacitorSQLite;
        this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
        this.isService = true;
        return true;
  }

  async initWebStore(): Promise<void> {
    try {
      await this.sqliteConnection.initWebStore();
    } catch(err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`initWebStore: ${err}`);
    }
  }

  async openDatabase(dbName:string, encrypted: boolean, mode: string, version: number, readonly: boolean): Promise<SQLiteDBConnection> {
    let db: SQLiteDBConnection;
    const retCC = (await this.sqliteConnection.checkConnectionsConsistency()).result;
    let isConn = (await this.sqliteConnection.isConnection(dbName, readonly)).result;
    if(retCC && isConn) {
      db = await this.sqliteConnection.retrieveConnection(dbName, readonly);
    } else {
      db = await this.sqliteConnection
                .createConnection(dbName, encrypted, mode, version, readonly);
    }
    await db.open();
    return db;
  }
  async retrieveConnection(dbName:string, readonly: boolean): Promise<SQLiteDBConnection> {
    return await this.sqliteConnection.retrieveConnection(dbName, readonly);
  }
  async closeConnection(database:string, readonly?: boolean): Promise<void> {
    const readOnly = readonly ? readonly : false;
    return await this.sqliteConnection.closeConnection(database, readOnly);
  }
  async addUpgradeStatement(options:capSQLiteUpgradeOptions): Promise<void> {
    await this.sqlitePlugin.addUpgradeStatement(options);
    return;
  }
  async saveToStore(database:string) : Promise<void> {
    return await this.sqliteConnection.saveToStore(database);
  }
}

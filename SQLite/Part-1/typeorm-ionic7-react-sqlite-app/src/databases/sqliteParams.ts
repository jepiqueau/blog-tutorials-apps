import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
const sqliteConnection: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
const sqlitePlugin = CapacitorSQLite;
const platform: string = Capacitor.getPlatform();
const sqliteParams = {
    connection: sqliteConnection,
    plugin: sqlitePlugin,
    platform: platform
}
export default sqliteParams;
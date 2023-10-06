import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection, capSQLiteUpgradeOptions } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { TDatabase } from '@/types/TDatabase';

export interface ISQLiteService {
//    sqliteConnection: SQLiteConnection
    getPlatform(): string;
    initWebStore(): Promise<void>;
    addUpgradeStatement(options: capSQLiteUpgradeOptions): Promise<void>; 
    openDatabase(dbName:string, version: number, readOnly: boolean, decrypt?: boolean): Promise<SQLiteDBConnection>;
    closeDatabase(dbName: string, readOnly: boolean): Promise<void>;
    saveToStore(dbName: string): Promise<void>;
    saveToLocalDisk(dbName: string): Promise<void>;
    isConnection(dbName: string, readOnly: boolean): Promise<boolean>;
    isDeviceEncryption(): Promise<boolean>;
    setEncryptionPassphrase(passphrase: string): Promise<void>;
    isSecretStored(): Promise<boolean>;
    clearEncryptionPassphrase(): Promise<void>;
    decryptAllDatabases(dbVerDict: Map<string, number>): Promise<void>;
    isPassphraseValid(passphrase: string): Promise<boolean>;
    changeEncryptionSecret(passphrase: string, oldpassphrase: string): Promise<void>;
    getDatabaseList(): Promise<any[]>;
};

class SQLiteService implements ISQLiteService {
    platform = Capacitor.getPlatform();
    sqlitePlugin = CapacitorSQLite;
    sqliteConnection = new SQLiteConnection(CapacitorSQLite);
    dbNameVersionDict: Map<string, number> = new Map();

    getPlatform(): string {
        return this.platform;
    }
    async initWebStore() : Promise<void>  {
        await this.sqliteConnection.initWebStore();
        return;
    }
    async addUpgradeStatement(options: capSQLiteUpgradeOptions): Promise<void> {
        await this.sqlitePlugin.addUpgradeStatement(options);
        return;
    }
    async openDatabase(dbName:string, version: number, readOnly: boolean, decrypt: boolean = false): Promise<SQLiteDBConnection>  {
        this.dbNameVersionDict.set(dbName, version);
        let db: SQLiteDBConnection;
        const retCC = (await this.sqliteConnection.checkConnectionsConsistency()).result;
        let isConn = (await this.sqliteConnection.isConnection(dbName, readOnly)).result;
        if(retCC && isConn) {
            db = await this.sqliteConnection.retrieveConnection(dbName, readOnly);
        } else {
            let encrypted = false;
            let mode = "no-encryption";
            if(this.platform !== "web") {
                const isDbExists = (await this.sqliteConnection.isDatabase(dbName)).result!;
                const isDevEncrypt = await this.isDeviceEncryption();
                const isDbEncrypt = isDevEncrypt && isDbExists
                        ? (await this.sqliteConnection.isDatabaseEncrypted(dbName)).result!
                        : false;
                const isPassphrase = isDevEncrypt 
                        ? await this.isSecretStored()
                        : false;
                encrypted = (!isDbExists && isDevEncrypt && isPassphrase) ||
                             (isDbExists && isDevEncrypt && isDbEncrypt && isPassphrase) ||
                             (isDbExists && isDevEncrypt && !isDbEncrypt && isPassphrase ) ? true : false;
                mode =  isDbExists && isDevEncrypt && !isDbEncrypt && isPassphrase
                            ? "encryption" 
                            : encrypted && decrypt ? "decryption"
                            : encrypted ? "secret" : "no-encryption";
            }
            db = await this.sqliteConnection
                    .createConnection(dbName, encrypted, mode, version, readOnly);
        }
    
        await db.open();
        const res = (await db.isDBOpen()).result;
        if(res) {
            return db;
        } else {
            const msg = "database not opened";
            throw new Error(`sqliteService.openDatabase: ${msg}`);
        }

    }
    async isConnection(dbName:string, readOnly: boolean): Promise<boolean> {
        const isConn = (await this.sqliteConnection.isConnection(dbName, readOnly)).result;
        if (isConn != undefined) {
            return isConn
        } else {
            throw new Error(`sqliteService.isConnection undefined`);
        }
        
    }
    async closeDatabase(dbName:string, readOnly: boolean):Promise<void> {
        const isConn = (await this.sqliteConnection.isConnection(dbName, readOnly)).result;
        if(isConn) {
            await this.sqliteConnection.closeConnection(dbName, readOnly);
        }
        return;
    }
    async saveToStore(dbName: string): Promise<void> {
        await this.sqliteConnection.saveToStore(dbName);
        return;
    }
    async saveToLocalDisk(dbName: string): Promise<void> {
        await this.sqliteConnection.saveToLocalDisk(dbName);
        return;
    }
    async isDeviceEncryption(): Promise<boolean> { 
        // Is platform allow for encryption
        const isPlatformEncryption = this.platform === 'web' ? false : true;
        // Check if isEncryption in the capacitor.config.ts
        const isEncryptInConfig = (await this.sqliteConnection.isInConfigEncryption()).result

        return isPlatformEncryption && isEncryptInConfig ? true : false;
    }
    async setEncryptionPassphrase(passphrase: string): Promise<void> {
        // check if a passphrase is already stored
        let isSetPassphrase = await this.isSecretStored();
        if(isSetPassphrase) {
            const msg = "Passphrase already stored";
            throw new Error(`sqliteService.setEncryptionPassphrase: ${msg}`);
        }
        return Promise.resolve(await this.sqliteConnection.setEncryptionSecret(passphrase));
    }
    async clearEncryptionPassphrase(): Promise<void> {
        // close all open connections
        await this.sqliteConnection.closeAllConnections();
        return await this.sqliteConnection.clearEncryptionSecret();
    }
    
    async isSecretStored(): Promise<boolean> {
        const res = await this.sqliteConnection.isSecretStored()
        return  res.result ?? false;
    }
    async getDatabaseList(): Promise<any[]> {
        const retDbList: TDatabase[] = [];
        const dbList = (await this.sqliteConnection.getDatabaseList()).values!;
        if(dbList.length > 0) {
            for (let idx:number = 0; idx < dbList.length; idx++) {
                const dbName = dbList[idx].split("SQLite.db")[0];
                const isEncrypt = (await this.sqliteConnection.isDatabaseEncrypted(dbName)).result!;
                const data: TDatabase = {name: dbName, encrypted: isEncrypt};
                retDbList.push(data);
            }
        }
        return retDbList;
    };
    async decryptAllDatabases(dbVerDict: Map<string, number>): Promise<void> {

        // close all open connections
        await this.sqliteConnection.closeAllConnections();
        // get the database list
        const dbList = await this.getDatabaseList();
        const encryptNames = dbList.filter(item => item.encrypted === true).map(item => item.name);
        for (const name of encryptNames) {
            const version = dbVerDict.get(name) ?? 1;
            // decrypt the database
            await this.openDatabase(name, version, false, true);
        }
        // close all open connections
        await this.sqliteConnection.closeAllConnections();
        // clear the passphrase
        await this.sqliteConnection.clearEncryptionSecret();
    }
    async isPassphraseValid(passphrase: string): Promise<boolean> {
        const res = await this.sqliteConnection.checkEncryptionSecret(passphrase);
        return  res.result ?? false;
    }
    async changeEncryptionSecret(passphrase: string, oldpassphrase: string): Promise<void> {
        return await this.sqliteConnection.changeEncryptionSecret(passphrase, oldpassphrase);
    }

  }
export default SQLiteService;

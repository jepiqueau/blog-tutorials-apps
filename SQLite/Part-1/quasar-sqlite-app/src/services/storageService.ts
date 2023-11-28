import { BehaviorSubject } from 'rxjs';
import { getCurrentInstance } from 'vue';
import { ISQLiteService } from '../services/sqliteService';
import { IDbVersionService } from '../services/dbVersionService';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { UserUpgradeStatements } from '../upgrades/user.statements';
import { User } from '../models/User';

export interface IStorageService {
  addUser(user: User): Promise<number>;
  deleteUserById(id: string): Promise<void>;
  getDatabaseName(): string;
  getDatabaseVersion(): number;
  getUsers(): Promise<User[]>;
  initializeDatabase(): Promise<void>;
  replaceUser(user: User): Promise<void>;
  updateUserActiveById(id: string, active: number): Promise<void>;
}
class StorageService implements IStorageService {
  versionUpgrades = UserUpgradeStatements;
  loadToVersion =
    UserUpgradeStatements[UserUpgradeStatements.length - 1].toVersion;
  db!: SQLiteDBConnection | undefined;
  database = 'myuserdb';
  sqliteServ!: ISQLiteService;
  dbVerServ!: IDbVersionService;
  isInitCompleted = new BehaviorSubject(false);
  appInstance = getCurrentInstance();
  platform!: string;

  constructor(
    sqliteService: ISQLiteService,
    dbVersionService: IDbVersionService
  ) {
    this.sqliteServ = sqliteService;
    this.dbVerServ = dbVersionService;
    this.platform =
      this.appInstance?.appContext.config.globalProperties.$platform;
  }

  async addUser(user: User): Promise<number> {
    // add a user to the database
    const colList = Object.keys(user).slice(1).toString();
    const valArr = Object.values(user).slice(1);
    const valList: string = valArr
      .map((value) => (typeof value === 'string' ? `'${value}'` : value))
      .join(',');

    const sql = `INSERT INTO users (${colList}) VALUES (${valList});`;
    const res = await this.db?.run(sql, []);
    if (
      res?.changes !== undefined &&
      res.changes.lastId !== undefined &&
      res.changes.lastId > 0
    ) {
      return res.changes.lastId;
    } else {
      throw new Error('storageService.addUser: lastId not returned');
    }
  }

  async deleteUserById(id: string): Promise<void> {
    // delete a user by id from the database
    const sql = `DELETE FROM users WHERE id=${id}`;
    await this.db?.run(sql);
  }

  getDatabaseName(): string {
    // return the database name
    return this.database;
  }

  getDatabaseVersion(): number {
    // return the database version
    return this.loadToVersion;
  }

  async getUsers(): Promise<User[]> {
    // return all users
    return (await this.db?.query('SELECT * FROM users;'))?.values as User[];
  }

  async initializeDatabase(): Promise<void> {
    // initialize the database
    try {
      // create upgrade statements
      await this.sqliteServ.addUpgradeStatement({
        database: this.database,
        upgrade: this.versionUpgrades,
      });
      // open the connection to the database with the latest version
      // and then open the database
      this.db = await this.sqliteServ.openDatabase(
        this.database,
        this.loadToVersion,
        false
      );
      const isData = await this.db?.query('select * from sqlite_sequence');
      if (isData?.values && isData.values.length === 0) {
        // create database initial users if any
      }
      // store the database version
      this.dbVerServ.setDbVersion(this.database, this.loadToVersion);
      if (this.platform === 'web') {
        await this.sqliteServ.saveToStore(this.database);
      }
      this.isInitCompleted.next(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const msg = error.message ? error.message : error;
      throw new Error(`storageService.initializeDatabase: ${msg}`);
    }
  }

  async replaceUser(user: User): Promise<void> {
    const colList = Object.keys(user).toString();
    const valArr = Object.values(user);
    const valList: string = valArr
      .map((value) => (typeof value === 'string' ? `'${value}'` : value))
      .join(',');
    const sql = `INSERT OR REPLACE INTO users (${colList}) VALUES (${valList});`;
    const res = await this.db?.run(sql, []);
    if (
      res?.changes !== undefined &&
      res.changes.lastId !== undefined &&
      res.changes.lastId > 0
    ) {
      return;
    } else {
      throw new Error('storageService.replaceUser: lastId not returned');
    }
  }

  async updateUserActiveById(id: string, active: number): Promise<void> {
    const sql = `UPDATE users SET active=${active} WHERE id=${id}`;
    await this.db?.run(sql);
  }
}
export default StorageService;

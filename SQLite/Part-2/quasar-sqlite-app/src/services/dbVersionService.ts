export interface IDbVersionService {
  getDbVersion(dbName: string): number | undefined;
  setDbVersion(dbName: string, version: number): void;
}
class DbVersionService implements IDbVersionService {
  dbNameVersionDict: Map<string, number> = new Map();

  getDbVersion(dbName: string): number | undefined {
    const version = this.dbNameVersionDict.get(dbName);
    return version;
  }

  setDbVersion(dbName: string, version: number) {
    this.dbNameVersionDict.set(dbName, version);
  }
}
export default DbVersionService;

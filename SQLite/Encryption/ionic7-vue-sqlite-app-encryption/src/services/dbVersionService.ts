export interface IDbVersionService {
    setDbVersion(dbName: string, version: number): void
    getDbVersion(dbName: string):number| undefined
    getDbVersionDict(): Map<string, number>
    printDbVersionDict(): void
};
class DbVersionService implements IDbVersionService  {
    dbNameVersionDict: Map<string, number> = new Map();

    setDbVersion(dbName: string, version: number) {
        this.dbNameVersionDict.set(dbName, version);
    };
    getDbVersion(dbName: string): number | undefined {
        const version =  this.dbNameVersionDict.get(dbName);
        return version;
    };
    getDbVersionDict(): Map<string, number> {
        return this.dbNameVersionDict;
    }
    printDbVersionDict(): void {
        for (const [dbName, version] of this.dbNameVersionDict) {
            console.log(`Database Name: ${dbName}, Version: ${version}`);
        }        
    }
};
export default DbVersionService;
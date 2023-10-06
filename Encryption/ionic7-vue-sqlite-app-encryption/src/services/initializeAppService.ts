import {ISQLiteService } from './sqliteService'; 
import {IStorageService } from './storageService'; 

export interface IInitializeAppService {
    initializeApp(globalState: any): Promise<boolean>
};

class InitializeAppService implements IInitializeAppService  {
    appInit = false;
    sqliteServ!: ISQLiteService;
    storageServ!: IStorageService;
    platform!: string;

    constructor(sqliteService: ISQLiteService, storageService: IStorageService) {
        this.sqliteServ = sqliteService;
        this.storageServ = storageService;
        this.platform = this.sqliteServ.getPlatform();
    }
    async initializeApp(globalState: any) : Promise<boolean> {
        if(!this.appInit) {
            if (this.platform === 'web') {
                await this.sqliteServ.initWebStore();
            } else {
                const isDevEncrypt = await this.sqliteServ.isDeviceEncryption();
                if(isDevEncrypt) {
                    const isSecretStored = await this.sqliteServ.isSecretStored();
                    // Modify globalState based on the result
                    globalState.isPassphrase = isSecretStored;
                }
            }
            // Initialize the myuserdb database
            await this.storageServ.initializeDatabase();
            if( this.platform === 'web') {
                await this.sqliteServ.saveToStore(this.storageServ.getDatabaseName());
            }
            this.appInit = true;
        }
        return this.appInit;
    }
}
export default InitializeAppService;

<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>DB's Encryption</ion-title>
          <ion-buttons slot="start">
            <ion-back-button text="home" default-href="/home"></ion-back-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <dbs-list :dblist="dbList" :onEncryption="handleEncryption" />
      </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
         IonContent} from '@ionic/vue';
import { Toast } from '@capacitor/toast';
import { TDatabase } from '@/types/TDatabase';

import DbsList from '@/components/DbsList.vue';
export default defineComponent({
    name: 'EncryptionPage',
    components: { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
        IonTitle, IonContent, DbsList },
    setup() {
        const dbList = ref<TDatabase[]>([]);
        const appInstance = getCurrentInstance();
        const sqliteServ = appInstance?.appContext.config.globalProperties.$sqliteServ;
        const dbVerServ = appInstance?.appContext.config.globalProperties.$dbVersionServ;

        const getDatabaseList = async () => {
            const list = await sqliteServ.getDatabaseList();
            dbList.value = list;
        }
        const handleEncryption = async (index:number) => {
            try {
                const dbName = dbList.value[index].name.split("SQLite.db")[0];
                // get the database version
                const version: number = await dbVerServ.getDbVersion(dbName);
                // check if the there is a connection for that database
                const isConn = await sqliteServ.isConnection(dbName, false);
                if (isConn) {
                    // close the connection
                    await sqliteServ.closeDatabase(dbName, false);
                }
                // encrypt the database
                await sqliteServ.openDatabase(dbName, version, false);
                dbList.value[index].encrypted = true;
                // close the connection
                await sqliteServ.closeDatabase(dbName, false);
                const msg = `Congratulations ${dbName} has been encrypted`;
                Toast.show({
                    text: msg,
                    duration: 'long'
                });
            } catch (error) {
                const msg = `Error handleEncryption: ${error}`;
                console.error(msg);
                Toast.show({
                    text: msg,
                    duration: 'long'
                });
            }

        }

        onMounted(async () => {
            await getDatabaseList();
        });
        return {dbList, handleEncryption}
    },
});
</script>

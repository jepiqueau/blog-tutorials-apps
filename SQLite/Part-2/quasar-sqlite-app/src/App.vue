<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { Capacitor } from '@capacitor/core';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';
import SqliteService from './services/sqliteService';
import DbVersionService from './services/dbVersionService';
import StorageService from './services/storageService';
import InitializeAppService from './services/initializeAppService';

const sqliteServ = new SqliteService();
const dbVersionServ = new DbVersionService();
const storageServ = new StorageService(sqliteServ, dbVersionServ);

export default defineComponent({
  name: 'App',
  provide: {
    sqliteServ,
    dbVersionServ,
    storageServ,
  },

  setup() {
    customElements.define('jeep-sqlite', JeepSqlite);
    const platform = Capacitor.getPlatform();
    //Define and instantiate the InitializeAppService
    const initAppServ = new InitializeAppService(sqliteServ, storageServ);

    const initApp = async () => {
      try {
        await initAppServ.initializeApp();
      } catch (error) {
        console.error('App Initialization error:', error);
      }
    };
    onMounted(async () => {
      if (platform != 'web') {
        await initApp();
      } else {
        const jeepEl = document.createElement('jeep-sqlite');
        document.body.appendChild(jeepEl);
        customElements
          .whenDefined('jeep-sqlite')
          .then(async () => {
            await initApp();
          })
          .catch((err) => {
            console.error('jeep-sqlite creation error:', err);
          });
      }
    });
    return {};
  },
});
</script>

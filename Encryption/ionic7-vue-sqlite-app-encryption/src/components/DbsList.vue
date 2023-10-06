<template>
    <ion-list class="DbsList">
      <ion-item v-for="(database, index) in dblist" :key="index">
        <ion-toggle
            v-model="isEncryptionChecked[index]"
            :disabled="isEncryptionDisabled[index]"
            @ionChange="handleToggleChange(index)"
        >
        {{database.name.split("SQLite.db")[0]}}
        </ion-toggle>
      </ion-item>
    </ion-list>
</template>
<script lang="ts">
    import { defineComponent, ref, watch } from 'vue';
    import { IonList, IonItem, IonToggle } from '@ionic/vue';
    import { TDatabase } from '@/types/TDatabase';
  
  
    export default defineComponent({
        name: 'DbsList',
        props: {
            dblist: Array as () => TDatabase[],
            onEncryption: Function,
        },
        components: { IonList, IonItem, IonToggle },
        setup(props) {
          // Initialize isEncryptionChecked based on the 'encrypted' property of each object in 'dblist'
          const isEncryptionChecked = ref(props.dblist!.map((item) => item.encrypted));
          // Initialize isEncryptionDisabled based on the 'encrypted' property of each object in 'dblist'
          const isEncryptionDisabled = ref(props.dblist!.map((item) => item.encrypted));
          // Watch for changes in the 'dblist' prop and update 'isEncryptionChecked' accordingly
          watch(
            () => props.dblist,
            (newDbList) => {
              isEncryptionChecked.value = newDbList!.map((item) => item.encrypted);
              isEncryptionDisabled.value = newDbList!.map((item) => item.encrypted);
            }
          );
          const handleToggleChange = (index: number) => {
                if (typeof props.onEncryption === 'function') {
                    props.onEncryption(index);
                }
            }
    
          return {
            handleToggleChange, isEncryptionChecked, isEncryptionDisabled
          };
        },
    });
</script>

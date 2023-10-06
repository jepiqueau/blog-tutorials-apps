<template>
    <div class="PassphraseForm">
        <ion-item-group v-if="!isPassSet" mode="ios">
            <ion-item-divider>
                <ion-label>Set Passphrase</ion-label>
            </ion-item-divider>
            <ion-item>
                <ion-input ref="ionPassEl" :value="passModel"
                    @ionInput="handlePassInput($event)" type="password"
                    placeholder="Passphrase (min 3 words)"
                ></ion-input>
                <ion-button slot="end" @click="handleSetPassphrase" :disabled="!isPassValid">
                    Set
                </ion-button>             
            </ion-item>
        </ion-item-group>
        <ion-item-group v-if="isPassSet" mode="ios">
            <ion-item-divider>
                <ion-label>Change Passphrase</ion-label>
            </ion-item-divider>
            <ion-item :disabled="isOldValid">
                <ion-input ref="ionOldPassEl" :value="oldPassModel"
                    @ionInput="handleOldPassInput($event)" type="password"
                    placeholder="Enter Old Passphrase"
                ></ion-input>
                <ion-button slot="end" @click="handleCheckPassphrase" :disabled="!isOldPassValid">
                    Check
                </ion-button>
            </ion-item>
            <ion-item :disabled="!isOldValid">
                <ion-input ref="ionNewPassEl" :value="newPassModel"
                    @ionInput="handleNewPassInput($event)" type="password"
                    placeholder="Enter New Passphrase"
                ></ion-input>
                <ion-button slot="end" @click="handleChangePassphrase" :disabled="!isNewPassValid">
                    Change
                </ion-button>
            </ion-item>
            <ion-item-divider>
                <ion-label>Clear Passphrase</ion-label>
            </ion-item-divider>
            <ion-item>
                <ion-input ref="ionCurPassEl" :value="curPassModel"
                    @ionInput="handleCurPassInput($event)" type="password"
                    placeholder="Enter Passphrase"
                ></ion-input>
                <ion-button slot="end" @click="handleClearPassphrase" :disabled="!isCurPassValid">
                    Clear
                </ion-button>
            </ion-item>
        </ion-item-group>
    </div>
</template>
  
<script lang="ts">
  import { ref } from 'vue';
  import { defineComponent, watch, getCurrentInstance } from 'vue';
  import { IonItemGroup, IonItemDivider, IonLabel, IonItem,
           IonInput, IonButton } from '@ionic/vue';
  import { Toast } from '@capacitor/toast';
  import { Dialog } from '@capacitor/dialog';

  export default defineComponent({
    name: 'PassphraseForm',
    components: {IonItemGroup, IonItemDivider, IonLabel, IonItem,
                 IonInput, IonButton},
    setup() {
        const appInstance = getCurrentInstance()!;
        const globalState = appInstance.appContext.config.globalProperties.$globalState;
        const sqliteServ = appInstance.appContext.config.globalProperties.$sqliteServ;
        const dbVerServ = appInstance.appContext.config.globalProperties.$dbVersionServ;
        const isPassphrase: boolean = globalState.isPassphrase;
        const ionPassEl = ref();
        const passModel = ref('');
        const isPassValid = ref(false);
        const isPassSet = ref(isPassphrase);
        const ionCurPassEl = ref();
        const curPassModel = ref('');
        const isCurPassValid = ref(false);
        const ionOldPassEl = ref();
        const oldPassModel = ref('');
        const isOldPassValid = ref(false);
        const isOldValid = ref(false);
        const ionNewPassEl = ref();
        const newPassModel = ref('');
        const isNewPassValid = ref(false);

        // *** Validation passphrase method ***

        const hasThreeWords = (input: string) => {
            const words = input.trim().split(' ');
            return input.length >= 12 && words.length === 3 && words.every((word) => word !== '');
        };

        // *** Setting passphrase methods ***

        const handlePassInput = (ev: { target: any; }) => {
            const value = ev.target!.value;
            const fileterdValue = value.replace(/[^a-zA-Z0-9-' ']+/g, '');
            passModel.value = value;
            const inputCmp = ionPassEl.value;
            if (inputCmp !== undefined) {
                inputCmp.$el.value  = fileterdValue;
            }
        };
        watch(passModel, (newPass) => {
            const hasThree = hasThreeWords(newPass);
            isPassValid.value = hasThree;
        });  
 
        const handleSetPassphrase = async () => {
            if (passModel.value) {
                try {
                    await sqliteServ.setEncryptionPassphrase(passModel.value);
                    passModel.value = '';
                    isPassValid.value = false;
                    globalState.isPassphrase = true; 

                } catch (error) {
                    const msg = `Error handleSetPassphrase: ${error}`;
                    console.error(msg);
                    Toast.show({
                        text: msg,
                        duration: 'long'
                    });
                }
            }
        };

        // *** Clearing passphrase methods ***

        const handleCurPassInput = (ev: { target: any; }) => {
            const value = ev.target!.value;
            const fileterdValue = value.replace(/[^a-zA-Z0-9-' ']+/g, '');
            curPassModel.value = value;
            const inputCmp = ionCurPassEl.value;
            if (inputCmp !== undefined) {
                inputCmp.$el.value  = fileterdValue;
            }
        };
        const handleClearPassphrase = async () => {
            if (curPassModel.value) {
                // check given passphrase 
                try {
                    const isValid = await sqliteServ.isPassphraseValid(curPassModel.value);
                    if(!isValid) {
                        const msg = `Error handleClearPassphrase: passphrase not valid`;
                            Toast.show({
                                text: msg,
                                duration: 'long'
                            });
                            curPassModel.value = '';
                            return;
                    }
                    const {value} = await Dialog.confirm({
                        title: 'Confirm',
                        message: `Are you sure? this will unencrypt all encrypted databases`,
                    });
                    if( value ) {

                        // get the dbVersionDict
                        const dbVerDict = await dbVerServ.getDbVersionDict();

                        await sqliteServ.decryptAllDatabases(dbVerDict);
                        curPassModel.value = '';
                        isCurPassValid.value = false;
                        globalState.isPassphrase = false; 

                    } else {
                        curPassModel.value = '';
                        isCurPassValid.value = false;
                    }

                } catch (error) {
                        const msg = `Error handleClearPassphrase: ${error}`;
                        console.error(msg);
                        Toast.show({
                            text: msg,
                            duration: 'long'
                        });
                        curPassModel.value = '';
                        isCurPassValid.value = false;
                }

            }
        };
        watch(curPassModel, (newPass) => {
            const hasThree = hasThreeWords(newPass);
            isCurPassValid.value = hasThree;
        }); 

        // *** Changing passphrase methods ***

        const handleOldPassInput = (ev: { target: any; }) => {
            const value = ev.target!.value;
            const fileterdValue = value.replace(/[^a-zA-Z0-9-' ']+/g, '');
            oldPassModel.value = value;
            const inputCmp = ionOldPassEl.value;
            if (inputCmp !== undefined) {
                inputCmp.$el.value  = fileterdValue;
            }
        };
        const handleCheckPassphrase = async () => {
            if (oldPassModel.value) {
                try {
                    const isValid = await sqliteServ.isPassphraseValid(oldPassModel.value);
                    if(!isValid) {
                        const msg = `Old Passphrase not valid`;
                        console.error(msg);
                        Toast.show({
                            text: msg,
                            duration: 'long'
                        });
                        oldPassModel.value = '';
                        isOldPassValid.value = false;
                        return;
                    }
                    isOldValid.value = true;
                } catch (error) {
                    oldPassModel.value = '';
                    isOldPassValid.value = false;
                    const msg = `Error handleCheckPassphrase: ${error}`;
                    console.error(msg);
                    Toast.show({
                        text: msg,
                        duration: 'long'
                    });
                }
            }
        };
        const handleNewPassInput = (ev: { target: any; }) => {
            const value = ev.target!.value;
            const fileterdValue = value.replace(/[^a-zA-Z0-9-' ']+/g, '');
            newPassModel.value = value;
            const inputCmp = ionNewPassEl.value;
            if (inputCmp !== undefined) {
                inputCmp.$el.value  = fileterdValue;
            }
        };
        const handleChangePassphrase = async () => {
            if (newPassModel.value) {
                try {
                    await sqliteServ.changeEncryptionSecret(newPassModel.value, oldPassModel.value);

                    const msg = `Congatulations: Passphrase has been updated`;
                    Toast.show({
                        text: msg,
                        duration: 'long'
                    });
                } catch (error) {
                    const msg = `Error handleChangePassphrase: ${error}`;
                    console.error(msg);
                    Toast.show({
                        text: msg,
                        duration: 'long'
                    });
                } finally {
                    oldPassModel.value = '';
                    isOldPassValid.value = false;
                    isOldValid.value = false;
                    newPassModel.value = '';
                    isNewPassValid.value = false;
                }
            }
        };

        watch(oldPassModel, (newPass) => {
            const hasThree = hasThreeWords(newPass);
            isOldPassValid.value = hasThree;
        });  
        watch(newPassModel, (newPass) => {
            const hasThree = hasThreeWords(newPass);
            isNewPassValid.value = hasThree;
        });  

        // *** Watching for globalState.isPassphrase changes ***

        watch( () => globalState.isPassphrase,
            (newValue, oldValue) => {
                // React to changes in isDisplay here, if needed
                isPassSet.value = newValue;
            }
        );

        return {
            isPassSet, ionPassEl, passModel, isPassValid,
            handlePassInput, handleSetPassphrase,
            ionCurPassEl, curPassModel, isCurPassValid,
            handleCurPassInput, handleClearPassphrase,
            ionOldPassEl, oldPassModel, isOldPassValid,
            handleOldPassInput, handleCheckPassphrase,
            isOldValid, ionNewPassEl, newPassModel,isNewPassValid,
            handleNewPassInput, handleChangePassphrase,
        };
    },
  });
</script>
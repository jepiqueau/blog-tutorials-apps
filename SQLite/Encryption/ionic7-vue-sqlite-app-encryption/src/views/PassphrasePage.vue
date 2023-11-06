<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Managing Passphrase</ion-title>
          <ion-buttons slot="start">
            <ion-back-button text="home" default-href="/home"></ion-back-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <passphrase-form></passphrase-form>
      </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
         IonContent} from '@ionic/vue';
import PassphraseForm from '@/components/PassphraseForm.vue';
import { Toast } from '@capacitor/toast';
export default defineComponent({
    name: 'PassphrasePage',
    components: { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
        IonTitle, IonContent, PassphraseForm },
    setup() {
    },
});
</script>

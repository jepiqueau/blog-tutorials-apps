<template>
  <q-page>
    <app-logo></app-logo>
    <app-intro-text></app-intro-text>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import AppLogo from 'components/AppLogo.vue';
import AppIntroText from 'components/AppIntroText.vue';
import { Capacitor } from '@capacitor/core';

export default defineComponent({
  name: 'IndexPage',
  components: { AppLogo, AppIntroText },
  setup() {
    const platform = Capacitor.getPlatform();
    console.log(`$$$ platform: ${platform}`);
    onMounted(() => {
      if (platform === 'ios') {
        const headerEl = document.querySelector('.q-header');
        headerEl?.classList.add('ios');
        const pageEl = document.querySelector('.q-page');
        pageEl?.classList.add('ios');
      }
    });
    return {};
  },
});
</script>

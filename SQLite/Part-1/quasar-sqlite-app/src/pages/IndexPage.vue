<template>
  <q-page>
    <app-logo></app-logo>
    <app-intro-text></app-intro-text>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppLogo from 'components/AppLogo.vue';
import AppIntroText from 'components/AppIntroText.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { AppLogo, AppIntroText },
  setup() {
    return {};
  },
});
</script>

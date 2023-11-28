<template>
  <div class="AppIntroText">
    <h3>Welcome to the Quasar SQLite Database CRUD App Example Tutorial</h3>
    <h5>using @capacitor-community/sqlite</h5>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'AppIntroText',
});
</script>

<style scoped>
.AppIntroText {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 0.5rem;
}
</style>

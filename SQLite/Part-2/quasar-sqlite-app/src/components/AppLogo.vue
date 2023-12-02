<template>
  <div class="AppLogo">
    <img src="/assets/JeepQLogo.png" alt="App Logo" width="128" height="128" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'AppLogo',
});
</script>

<style scoped>
.AppLogo {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style>

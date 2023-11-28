<template>
  <q-item clickable @click="onClick()">
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MenuRoute',
  props: {
    title: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
  },
  methods: {
    onClick() {
      this.$router.push({ name: this.$props.name });
    },
  },
});
</script>

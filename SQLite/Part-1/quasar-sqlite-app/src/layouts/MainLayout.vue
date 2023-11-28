<template>
  <q-layout ref="layout" view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn v-if="isBack" @click="goBack">Back</q-btn>
        <q-toolbar-title>{{ pageTitle }} </q-toolbar-title>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleRightDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu Content </q-item-label>

        <MenuRoute v-for="page in pages" :key="page.title" v-bind="page" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MenuRoute from 'components/MenuRoute.vue';

const pageList = [
  {
    title: 'Managing Users',
    name: 'users',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    MenuRoute,
  },

  setup() {
    const rightDrawerOpen = ref(false);
    return {
      pages: pageList,
      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },
    };
  },
  data() {
    return {
      pageTitle: 'Quasar SQLite App', // Set your default title here
      isBack: false,
    };
  },
  watch: {
    // Watch for changes in the route and update the pageTitle accordingly
    $route(to) {
      if (to.name !== 'home') this.isBack = true;
      this.pageTitle = to.meta.title || 'Quasar SQLite App';
    },
  },
  methods: {
    goBack() {
      this.isBack = false;
      this.$router.push({ name: 'home' });
    },
  },
});
</script>

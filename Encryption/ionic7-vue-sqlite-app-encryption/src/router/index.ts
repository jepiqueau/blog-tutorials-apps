import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import UsersPage from '../views/UsersPage.vue';
import PassphrasePage from '../views/PassphrasePage.vue';
import EncryptionPage from '../views/EncryptionPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: "/users",
    name: "Users",
    component: UsersPage,
  },
  {
    path: "/passphrase",
    name: "Passphrase",
    component: PassphrasePage,
  },
  {
    path: "/encryption",
    name: "Encryption",
    component: EncryptionPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export { router }

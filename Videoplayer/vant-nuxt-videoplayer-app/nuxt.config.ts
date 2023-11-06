// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
    title: 'Vant Nuxt VideoPlayer App',
    meta: [
        { name: 'viewport', content: 'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'},
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-tap-highlight', content:'no'},
        { name: 'apple-mobile-web-app-capable', content:'yes' },
        { name: 'apple-mobile-web-app-title', content:'Vant Nuxt VideoPlayer App' },
        { name: 'apple-mobile-web-app-status-bar-style', content:'black'},
    ]
    }
  },
  devtools: { enabled: true },
  modules: ['@vant/nuxt'],
})

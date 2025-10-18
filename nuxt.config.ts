export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Sample Project',
    },
  },
  components: {
    global: true,
    dirs: ['@/components/ui'],
  },
  modules: ['@vueuse/nuxt'],
  css: ['@/assets/main.css'],
});

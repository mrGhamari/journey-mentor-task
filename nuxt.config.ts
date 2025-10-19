export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Sample Project',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;600;800&display=swap',
        },
      ],
    },
  },
  components: {
    global: true,
    dirs: ['@/components/ui'],
  },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/fonts'],
  css: ['@/assets/main.css'],
});

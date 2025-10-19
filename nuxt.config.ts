// nuxt.config.ts
const repoBase =
  import.meta.env.NUXT_PUBLIC_BASE_URL ||
  (import.meta.env.GITHUB_ACTIONS && import.meta.env.GITHUB_REPOSITORY
    ? `/${import.meta.env.GITHUB_REPOSITORY.split('/').pop()}/`
    : '/');

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  app: {
    baseURL: repoBase,
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Sample Project',
      script: [
        {
          children:
            "(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s||(d?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();",
          tagPosition: 'head',
        },
      ],
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

  routeRules: {
    '/**': { prerender: true },
  },

  nitro: {
    preset: import.meta.env.GITHUB_ACTIONS ? 'github-pages' : undefined,
    prerender: {
      routes: ['/200.html', '/404.html'],
      failOnError: false,
      crawlLinks: true,
    },
  },
});
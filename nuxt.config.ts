const repoBase = process.env.NUXT_PUBLIC_BASE_URL
  || (process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/').pop()}/`
    : '/');

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Sample Project',
      // Inline theme init to avoid FOUC and ensure correct theme before paint
      script: [
        {
          children:
            "(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s|| (d?'dark':'light');document.documentElement.setAttribute('data-theme', t);}catch(e){}})();",
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
    baseURL: repoBase,
  },
  components: {
    global: true,
    dirs: ['@/components/ui'],
  },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/fonts'],
  css: ['@/assets/main.css'],
  nitro: {
    preset: process.env.GITHUB_ACTIONS ? 'github-pages' : undefined,
  },
});

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      API_URL: process.env.NUXT_API_URL,
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    plugins: [vuetify({ autoImport: true })],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  modules: ["@pinia/nuxt"],
  plugins: ["@/plugins/nprogress.client.ts"],
  css: [
    "@/assets/scss/global.scss",
    "@/assets/scss/animates.scss",
    "@/assets/scss/button.scss",
    "@/assets/scss/loader.scss",
    "@/assets/scss/progress.scss",
  ],
  app: {
    head: {
      title: "SeaotterMSのblog",
      meta: [
        { name: "description", content: "放一些技術以及日常的東東" },
        { property: "og:title", content: "SeaotterMSのblog" },
        { property: "og:description", content: "放一些技術以及日常的東東" },
        { property: "og:image", content: process.env.NUXT_PUBLIC_SITE_URL + "background.png" },
        { property: "og:url", content: process.env.NUXT_PUBLIC_SITE_URL },
        { property: "og:type", content: "website" },
      ],
      link: [
        { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/icon?family=Material+Icons" },
        { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" },
        { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/wowjs@1.1.3/css/libs/animate.min.css" },
      ],
      script: [
        {
          src: "https://kit.fontawesome.com/8f1caa7fe1.js",
          crossorigin: "anonymous",
          defer: true,
        },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js", defer: true },
        { src: "https://cdn.jsdelivr.net/npm/typed.js@2.0.12", crossorigin: "anonymous", defer: true },
        { src: "https://cdn.jsdelivr.net/npm/wowjs@1.1.3/dist/wow.min.js", defer: true },
      ],
    },
  },
});

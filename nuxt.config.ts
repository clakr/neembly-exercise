// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxtjs/tailwindcss"],
  app: {
    head: {
      link: [
        {
          rel: "preload",
          as: "font",
          href: "/fonts/Inter.ttf",
          type: "font/ttf",
          crossorigin: "anonymous",
        },
      ],
    },
  },
  tailwindcss: {
    cssPath: "base.css",
    configPath: "tailwind.config",
  },
});

// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "dark", // 指定預設為暗色模式
      themes: {
        dark: {
          dark: true,
          colors: {
            background: "#121212",
            surface: "#1E1E1E",
            primary: "#F596AA",
            secondary: "#424242",
            error: "#FF5252",
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#FB8C00",
          },
        },
      },
    },
  });
  app.vueApp.use(vuetify);
});

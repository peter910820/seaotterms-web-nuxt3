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
      defaultTheme: "v1theme",
      themes: {
        v1theme: {
          dark: false,
          colors: {
            background: "#F2EBEA",
            border: "#FAFAFA",
            surface: "#FAFAFA",
            primary: "#E64A6B",
            secondary: "#BDBDBD",
            error: "#D32F2F",
            info: "#1976D2",
            success: "#388E3C",
            warning: "#F57C00",
            tagColor: "#9C27B0",
          },
          variables: {
            "banner-image": 'url("/background.png")',
            // Light accent colors - can be used for card backgrounds
            "card-color-1": "#FFF9E6", // Light beige
            "card-color-2": "#F0F8FF", // Light sky blue
            "card-color-3": "#F5F0FF", // Light lavender
            "card-color-4": "#F0FFF4", // Light mint green
            "card-color-5": "#FFF5F5", // Light pink
            "card-color-6": "#FFF8E1", // Light lemon yellow
            "card-color-7": "#E8F4F8", // Light cyan
            "card-color-8": "#FFF0F5", // Light rose
          },
        },
        // dark: {
        //   dark: true,
        //   colors: {
        //     background: "#121212",
        //     surface: "#1E1E1E",
        //     primary: "#F596AA",
        //     secondary: "#424242",
        //     error: "#FF5252",
        //     info: "#2196F3",
        //     success: "#4CAF50",
        //     warning: "#FB8C00",
        //   },
        // },
      },
    },
  });
  app.vueApp.use(vuetify);
});

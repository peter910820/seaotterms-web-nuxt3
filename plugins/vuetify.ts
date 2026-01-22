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
      defaultTheme: "v1-theme",
      themes: {
        "v1-theme": {
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
            // Button colors
            "button-submit-bg": "#c2fbd7",
            "button-submit-text": "#388E3C",
            "button-management": "#ff4742",
            "button-management-hover": "#ff4742",
            "button-status-start": "#ef4765",
            "button-status-end": "#ff9a5a",
            "button-disabled": "#ccc",
            // Status button colors
            "status-n-start": "#ff0000",
            "status-n-end": "#ff2f13",
            "status-p-start": "#0000ff",
            "status-p-end": "#287be9",
            "status-s-start": "#9848f3",
            "status-s-end": "#9848f3",
            "status-c-start": "#00ff00",
            "status-c-end": "#35fc4f",
            "status-e-start": "#87ceeb",
            "status-e-end": "#79e5e9",
            "status-d-start": "#000000",
            "status-d-end": "#222121",
            "status-d-hover-start": "#d32f2f",
            "status-d-hover-end": "#f44336",
            // Inactive button colors
            "button-inactive-start": "#e0e0e0",
            "button-inactive-end": "#bdbdbd",
            "button-inactive-text": "#424242",
            "button-inactive-hover-start": "#bdbdbd",
            "button-inactive-hover-end": "#9e9e9e",
            "button-inactive-hover-text": "#212121",
            // Active button colors
            "button-active-n-start": "#ff4444",
            "button-active-n-end": "#ff6b6b",
            "button-active-p-start": "#4a90e2",
            "button-active-p-end": "#5ba3f5",
            "button-active-s-start": "#9c27b0",
            "button-active-s-end": "#ba68c8",
            "button-active-c-start": "#4caf50",
            "button-active-c-end": "#66bb6a",
            "button-active-e-start": "#00bcd4",
            "button-active-e-end": "#4dd0e1",
            // Text colors
            "text-primary": "#000000",
            "text-secondary": "#444444",
            "text-tertiary": "#666666",
            "text-olive": "#808000",
            "text-orange": "#ff9800",
            "text-red": "#d32f2f",
            "text-blue": "#287be9",
            // Loader colors
            "loader-color": "#25b09b",
            // Progress colors
            "progress-color": "#d2691e",
            // Code block colors
            "code-bg": "#1e1e1e",
          },
          variables: {
            "banner-image": 'url("/background.png")',
            // Card background color
            "card-color-1": "#FFF9E6", // Light beige
            // Button shadow colors (merged similar shadow styles)
            "button-submit-shadow": "rgba(44, 187, 99, 0.2)",
            "button-status-shadow": "rgba(239, 71, 101, 0.5)",
            "button-simple-shadow": "rgba(45, 35, 66, 0.4)",
            // Text RGB values for rgb() function usage
            "text-orange-rgb": "255, 152, 0",
            "text-red-rgb": "211, 47, 47",
            // Overlay and background colors
            "banner-overlay": "rgba(240, 248, 255, 0.5)",
            // Shadow colors (unified shadow system)
            "shadow-light": "rgba(0, 0, 0, 0.1)",
            "shadow-medium": "rgba(0, 0, 0, 0.15)",
            "shadow-dark": "rgba(0, 0, 0, 0.2)",
            // Note: code-text-bg uses same value as shadow-light, so we use shadow-light instead
          },
        },
        "darkness-theme": {
          dark: true,
          colors: {
            background: "#1a1a2e",
            border: "#3a3a5c",
            surface: "#16213e",
            primary: "#F596AA",
            secondary: "#7a7a9e",
            error: "#FF5252",
            info: "#64B5F6",
            success: "#81C784",
            warning: "#FFB74D",
            tagColor: "#CE93D8",
            // Button colors
            "button-submit-bg": "#2d5a3d",
            "button-submit-text": "#81C784",
            "button-management": "#ff6b6b",
            "button-management-hover": "#ff6b6b",
            "button-status-start": "#ef4765",
            "button-status-end": "#ff9a5a",
            "button-disabled": "#555555",
            // Status button colors
            "status-n-start": "#ff5252",
            "status-n-end": "#ff7979",
            "status-p-start": "#64B5F6",
            "status-p-end": "#90CAF9",
            "status-s-start": "#BA68C8",
            "status-s-end": "#CE93D8",
            "status-c-start": "#66BB6A",
            "status-c-end": "#81C784",
            "status-e-start": "#4DD0E1",
            "status-e-end": "#80DEEA",
            "status-d-start": "#424242",
            "status-d-end": "#616161",
            "status-d-hover-start": "#E57373",
            "status-d-hover-end": "#EF5350",
            // Inactive button colors
            "button-inactive-start": "#424242",
            "button-inactive-end": "#616161",
            "button-inactive-text": "#B0B0B0",
            "button-inactive-hover-start": "#616161",
            "button-inactive-hover-end": "#757575",
            "button-inactive-hover-text": "#E0E0E0",
            // Active button colors
            "button-active-n-start": "#E57373",
            "button-active-n-end": "#EF5350",
            "button-active-p-start": "#64B5F6",
            "button-active-p-end": "#90CAF9",
            "button-active-s-start": "#BA68C8",
            "button-active-s-end": "#CE93D8",
            "button-active-c-start": "#66BB6A",
            "button-active-c-end": "#81C784",
            "button-active-e-start": "#4DD0E1",
            "button-active-e-end": "#80DEEA",
            // Text colors
            "text-primary": "#E8E8F0",
            "text-secondary": "#C8C8D8",
            "text-tertiary": "#A0A0B0",
            "text-olive": "#C5D86D",
            "text-orange": "#FFB74D",
            "text-red": "#EF5350",
            "text-blue": "#64B5F6",
            // Loader colors
            "loader-color": "#4DD0E1",
            // Progress colors
            "progress-color": "#FFB74D",
            // Code block colors
            "code-bg": "#1E1E1E",
          },
          variables: {
            "banner-image": 'url("/background.png")',
            // Card background color
            "card-color-1": "#2D2D2D", // Dark card
            // Button shadow colors
            "button-submit-shadow": "rgba(129, 199, 132, 0.3)",
            "button-status-shadow": "rgba(239, 71, 101, 0.6)",
            "button-simple-shadow": "rgba(245, 150, 170, 0.5)",
            // Text RGB values for rgb() function usage
            "text-orange-rgb": "255, 183, 77",
            "text-red-rgb": "239, 83, 80",
            // Overlay and background colors
            "banner-overlay": "rgba(18, 18, 18, 0.7)",
            // Shadow colors (unified shadow system)
            "shadow-light": "rgba(0, 0, 0, 0.3)",
            "shadow-medium": "rgba(0, 0, 0, 0.5)",
            "shadow-dark": "rgba(0, 0, 0, 0.7)",
          },
        },
      },
    },
  });
  app.vueApp.use(vuetify);
});

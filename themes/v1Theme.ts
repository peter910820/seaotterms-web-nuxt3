import type { ThemeDefinition } from "vuetify";

export const v1Theme: ThemeDefinition = {
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
  },
};

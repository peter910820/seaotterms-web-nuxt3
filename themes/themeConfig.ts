import type { VuetifyOptions } from "vuetify";
import { darknessTheme } from "./darknessTheme";
import { v1Theme } from "./v1Theme";

export type AppTheme = "v1-theme" | "darkness-theme";

export const DEFAULT_THEME: AppTheme = "darkness-theme";
export const THEME_COOKIE_NAME = "blog-theme";

export const themes = {
  "v1-theme": v1Theme,
  "darkness-theme": darknessTheme,
};

export const themeConfig: NonNullable<VuetifyOptions["theme"]> = {
  defaultTheme: DEFAULT_THEME,
  themes,
};

export const themeCookieOptions = {
  default: (): AppTheme => DEFAULT_THEME,
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
  sameSite: "lax" as const,
};

export const isAppTheme = (value: unknown): value is AppTheme =>
  typeof value === "string" && value in themes;

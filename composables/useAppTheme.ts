import { useTheme } from "vuetify";
import {
  DEFAULT_THEME,
  THEME_COOKIE_NAME,
  isAppTheme,
  themeCookieOptions,
  type AppTheme,
} from "@/themes/themeConfig";

export const useAppTheme = () => {
  const theme = useTheme();
  const themeCookie = useCookie<AppTheme>(THEME_COOKIE_NAME, themeCookieOptions);

  const currentTheme = computed<AppTheme>({
    get: () => (isAppTheme(theme.global.name.value) ? theme.global.name.value : DEFAULT_THEME),
    set: (name: AppTheme) => {
      setTheme(name);
    },
  });

  const isDark = computed(() => theme.global.current.value.dark);

  const setTheme = (name: AppTheme) => {
    if (!isAppTheme(name)) return;
    theme.change(name);
    themeCookie.value = name;
  };

  const toggleTheme = () => {
    const nextTheme: AppTheme = isDark.value ? "v1-theme" : "darkness-theme";
    setTheme(nextTheme);
  };

  return {
    theme,
    currentTheme,
    isDark,
    toggleTheme,
    setTheme,
  };
};

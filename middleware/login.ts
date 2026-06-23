export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  const userStore = useUserStore();

  const session = useCookie("blog-userinfo-session", {
    path: "/",
    maxAge: 0,
    sameSite: "none",
    domain: useRuntimeConfig().public.rootDomain,
    secure: true,
  });
  session.value = null;
  userStore.reset();
});

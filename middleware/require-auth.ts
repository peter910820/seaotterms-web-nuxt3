export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  if (user.value.id === 0) {
    alert("使用者未登入");
    const { openLoginModal } = useLoginModal();
    openLoginModal();
    return navigateTo("/");
  }
});

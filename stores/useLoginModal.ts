export const useLoginModal = () => {
  const showLoginModal = useState<boolean>("login-modal", () => false);

  const openLoginModal = () => {
    showLoginModal.value = true;
  };

  const closeLoginModal = () => {
    showLoginModal.value = false;
  };

  return {
    showLoginModal,
    openLoginModal,
    closeLoginModal,
  };
};

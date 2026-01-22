<script setup lang="ts">
import { useLoginModal } from "@/stores/useLoginModal";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { showLoginModal, openLoginModal } = useLoginModal();

const userData = computed(() => user.value);
const drawer = ref(false);
const profileDrawer = ref(false);

const todoMenu = ref(false);
const galgameMenu = ref(false);
const otherMenu = ref(false);

const handleLogout = () => {
  const session = useCookie("blog-userinfo-session", {
    path: "/",
    maxAge: 0,
    sameSite: "none",
    domain: import.meta.env.VITE_ROOT_DOMAIN,
    secure: true,
  });
  session.value = null;
  userStore.reset();
  drawer.value = false;
};
</script>

<template>
  <v-app-bar color="background" elevation="2" class="navbar" app>
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>

    <v-app-bar-title>
      <NuxtLink to="/" class="brand-link">Home</NuxtLink>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- Desktop Navigation -->
    <div class="d-none d-md-flex align-center">
      <v-btn variant="text" to="/" prepend-icon="mdi-home">首頁</v-btn>

      <v-btn variant="text" to="/system-todos" prepend-icon="mdi-calendar-clock">系統更新待辦</v-btn>

      <v-menu v-model="todoMenu" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn variant="text" v-bind="props" prepend-icon="mdi-check-circle" append-icon="mdi-menu-down">
            Todo
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/todolists" prepend-icon="mdi-format-list-checks" title="TodoList"></v-list-item>
          <v-list-item to="/todo-topics/create" prepend-icon="mdi-tag-plus" title="建立Todo類別"></v-list-item>
        </v-list>
      </v-menu>

      <v-menu v-model="galgameMenu" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn variant="text" v-bind="props" prepend-icon="mdi-dice-multiple" append-icon="mdi-menu-down">
            Galgame
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/self-galgames" prepend-icon="mdi-dice-multiple" title="Galgame紀錄"></v-list-item>
        </v-list>
      </v-menu>

      <v-menu v-model="otherMenu" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn variant="text" v-bind="props" prepend-icon="mdi-home-group" append-icon="mdi-menu-down">
            其他功能
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/articles/create" prepend-icon="mdi-pencil" title="建立文章"></v-list-item>
          <v-list-item to="/todo-topics/system/create" prepend-icon="mdi-server" title="建立系統站台"></v-list-item>
          <v-list-item
            v-if="userData.id !== undefined && userData.id !== 0"
            to="/user-maintain"
            prepend-icon="mdi-account-cog"
            title="使用者帳號維護"
          ></v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        v-if="userData.username === '' || userData.username === undefined"
        variant="text"
        prepend-icon="mdi-login"
        @click.prevent="openLoginModal"
      >
        登入
      </v-btn>
      <template v-else>
        <v-btn variant="text" prepend-icon="mdi-account-circle" @click.prevent="profileDrawer = true"> 個人資料 </v-btn>
        <v-btn variant="text" prepend-icon="mdi-logout" @click.prevent="handleLogout">登出</v-btn>
      </template>
    </div>

    <LoginModal v-model="showLoginModal" />
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" temporary location="left" class="mobile-drawer">
    <v-list>
      <v-list-item to="/" prepend-icon="mdi-home" title="首頁" @click="drawer = false"></v-list-item>
      <v-list-item
        to="/system-todos"
        prepend-icon="mdi-calendar-clock"
        title="系統更新待辦"
        @click="drawer = false"
      ></v-list-item>
      <v-list-item
        to="/self-galgames/new"
        prepend-icon="mdi-plus-circle"
        title="新Galgame紀錄"
        @click="drawer = false"
      ></v-list-item>
      <v-list-item
        to="/self-galgames"
        prepend-icon="mdi-dice-multiple"
        title="Galgame紀錄"
        @click="drawer = false"
      ></v-list-item>
      <v-list-item
        to="/todolists"
        prepend-icon="mdi-format-list-checks"
        title="TodoList"
        @click="drawer = false"
      ></v-list-item>
      <v-list-item
        to="/todo-topics/create"
        prepend-icon="mdi-tag-plus"
        title="建立Todo類別"
        @click="drawer = false"
      ></v-list-item>
      <v-list-item
        to="/articles/create"
        prepend-icon="mdi-pencil"
        title="建立文章"
        @click="drawer = false"
      ></v-list-item>
      <v-list-item
        v-if="userData.username !== '' && userData.username !== undefined"
        to="/user-maintain"
        prepend-icon="mdi-account-cog"
        title="使用者帳號維護"
        @click="drawer = false"
      ></v-list-item>
      <v-list-item
        v-if="userData.username !== '' && userData.username !== undefined"
        prepend-icon="mdi-account-circle"
        title="個人資料"
        @click="
          profileDrawer = true;
          drawer = false;
        "
      ></v-list-item>
      <v-list-item
        v-if="userData.username === '' || userData.username === undefined"
        prepend-icon="mdi-login"
        title="登入"
        @click="
          openLoginModal();
          drawer = false;
        "
      ></v-list-item>
      <v-list-item v-else prepend-icon="mdi-logout" title="登出" @click="handleLogout"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- Profile Drawer (from right) -->
  <v-navigation-drawer v-model="profileDrawer" temporary location="right" width="400" class="profile-drawer" touchable>
    <template v-slot:prepend>
      <v-toolbar color="transparent" density="compact">
        <v-spacer></v-spacer>
        <v-btn icon variant="text" @click="profileDrawer = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
    </template>
    <ClientOnly>
      <MyProfile />
    </ClientOnly>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
.navbar {
  background-color: rgb(var(--v-theme-background)) !important;
  border-bottom: 2px solid rgb(var(--v-theme-border));
}

.brand-link {
  text-decoration: none;
  color: rgb(var(--v-theme-text-primary));
  font-weight: 600;
  font-size: 1.25rem;

  &:hover {
    opacity: 0.8;
  }
}

.mobile-drawer {
  background-color: rgb(var(--v-theme-background)) !important;
}

.profile-drawer {
  background-color: rgb(var(--v-theme-background)) !important;

  // Hide scrollbar but keep scroll functionality
  :deep(.v-navigation-drawer__content) {
    overflow-y: auto;
    scrollbar-width: none; // Firefox
    -ms-overflow-style: none; // IE and Edge

    &::-webkit-scrollbar {
      display: none; // Chrome, Safari, Opera
    }
  }
}

:deep(.v-list-item) {
  color: rgb(var(--v-theme-text-secondary));
}

:deep(.v-overlay__scrim) {
  pointer-events: auto !important;
}
</style>

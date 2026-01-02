<script setup lang="ts">
import { initMaterialSidenav, initMaterialDropdown } from "@/composables/useMaterial";
import { useLoginModal } from "@/stores/useLoginModal";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { showLoginModal, openLoginModal } = useLoginModal();

const userData = computed(() => user.value);

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
};

onMounted(() => {
  initMaterialSidenav();
  initMaterialDropdown();
});
</script>

<template>
  <!-- Todo Dropdown Structure -->
  <ul id="todo-dropdown" class="dropdown-content">
    <li>
      <router-link to="/todolists">
        TodoList
        <i class="material-icons left">checklist</i>
      </router-link>
    </li>
    <li>
      <router-link to="/todo-topics/create">
        建立Todo類別
        <i class="material-icons left">fact_check</i>
      </router-link>
    </li>
  </ul>
  <!-- Galgame Dropdown Structure -->
  <ul id="galgame-dropdown" class="dropdown-content">
    <li>
      <router-link to="/self-galgames">
        Galgame紀錄
        <i class="material-icons left">casino</i>
      </router-link>
    </li>
    <li>
      <router-link to="/self-galgames/operation">
        Galgame文章作業
        <i class="material-icons left">description</i>
      </router-link>
    </li>
  </ul>
  <!-- Other Dropdown Structure -->
  <ul id="other-dropdown" class="dropdown-content">
    <li>
      <router-link to="/articles/create">
        建立文章
        <i class="material-icons left">edit</i>
      </router-link>
    </li>
    <li>
      <router-link to="/todo-topics/system/create">
        建立系統站台
        <i class="material-icons left">system_update_alt</i>
      </router-link>
    </li>
    <li v-if="userData.id !== undefined && userData.id !== 0">
      <router-link to="/user-maintain">
        使用者帳號維護
        <i class="material-icons left">manage_accounts</i>
      </router-link>
    </li>
  </ul>
  <!-- Main Navbar -->
  <nav>
    <div class="nav-wrapper">
      <router-link to="/" class="brand-logo">Home</router-link>
      <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
      <!-- common -->
      <ul class="right hide-on-med-and-down">
        <li>
          <router-link to="/">
            首頁
            <i class="material-icons left">home</i>
          </router-link>
        </li>
        <li>
          <router-link to="/system-todos">
            系統更新待辦
            <i class="material-icons left">pending_actions</i>
          </router-link>
        </li>
        <li>
          <a class="dropdown-trigger" href="#!" data-target="todo-dropdown">
            <i class="material-icons left">checklist</i>
            Todo
            <i class="material-icons right">arrow_drop_down</i>
          </a>
        </li>
        <li>
          <a class="dropdown-trigger" href="#!" data-target="galgame-dropdown">
            <i class="material-icons left">casino</i>
            Galgame
            <i class="material-icons right">arrow_drop_down</i>
          </a>
        </li>
        <li>
          <a class="dropdown-trigger" href="#!" data-target="other-dropdown">
            <i class="material-icons left">other_houses</i>
            其他功能
            <i class="material-icons right">arrow_drop_down</i>
          </a>
        </li>
        <li>
          <!-- <router-link to="/register"
            >註冊<i class="material-icons left">how_to_reg</i></router-link
          > -->
        </li>
        <li>
          <a
            v-if="userData.username === '' || userData.username === undefined"
            href="#"
            @click.prevent="openLoginModal"
          >
            登入
            <i class="material-icons left">login</i>
          </a>
          <a v-else href="#" @click.prevent="handleLogout">
            登出
            <i class="material-icons left">logout</i>
          </a>
        </li>
      </ul>
    </div>
  </nav>
  <!-- mobile -->
  <ul class="sidenav" id="mobile-demo">
    <li>
      <router-link to="/">首頁</router-link>
    </li>
    <li>
      <router-link to="/system-todos">系統更新待辦</router-link>
    </li>
    <li>
      <router-link to="/self-galgames/new">新Galgame紀錄</router-link>
    </li>
    <li>
      <router-link to="/self-galgames">Galgame紀錄</router-link>
    </li>
    <li>
      <router-link to="/self-galgames/operation">Galgame文章作業</router-link>
    </li>
    <li>
      <router-link to="/todolists">TodoList</router-link>
    </li>
    <li>
      <router-link to="/todo-topics/create">建立Todo類別</router-link>
    </li>
    <li>
      <router-link to="/articles/create">建立文章</router-link>
    </li>
    <!-- <li>
      <router-link to="/register">註冊</router-link>
    </li> -->
    <li>
      <router-link v-if="userData.username !== '' && userData.username !== undefined" to="/user-maintain">
        使用者帳號維護
      </router-link>
    </li>
    <li>
      <a v-if="userData.username === '' || userData.username === undefined" href="#" @click.prevent="openLoginModal"
        >登入</a
      >
      <a v-else href="#" @click.prevent="handleLogout">登出</a>
    </li>
  </ul>

  <LoginModal v-model="showLoginModal" />
</template>

<style lang="scss" scoped>
.nav-wrapper {
  background-color: rgb(var(--v-theme-background));
}

.brand-logo {
  margin-left: 10px;
}

a {
  color: #444444 !important;
}

.dropdown-trigger {
  padding-right: 0px;
}

.dropdown-content {
  width: 220px !important;
  background-color: rgb(var(--v-theme-background));
  border-radius: 10px;
}
</style>

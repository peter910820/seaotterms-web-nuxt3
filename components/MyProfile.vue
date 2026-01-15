<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/useUserStore";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Typed: any;

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const isHoveredGithub = ref(false);
const isHoveredTwitter = ref(false);

const userData = computed(() => user.value);

onMounted(() => {
  // eslint-disable-next-line no-undef
  new Typed(".typer", {
    strings: ["一個不知道在幹嘛，每天一直假裝自己有在做事的人。"],
    typeSpeed: 100,
  });
});
</script>

<template>
  <div class="my-profile">
    <div class="profile-header">
      <div class="headShot">
        <img
          v-if="userData.avatar !== '' && userData.avatar !== undefined"
          :src="userData.avatar"
          :alt="userData.username"
        />
        <img v-else src="/headshot.png" alt="Default Avatar" />
      </div>
    </div>

    <div class="profile-content">
      <div v-if="userData.username !== '' && userData.username !== undefined" class="myName">
        {{ userData.username }}
      </div>
      <div v-else class="myName not-logged-in">使用者未登入</div>

      <div class="aboutMe typer"></div>

      <div class="project-link">
        <v-btn
          href="https://github.com/peter910820/seaotterms.com"
          target="_blank"
          color="primary"
          variant="elevated"
          size="large"
          block
          class="project-btn"
        >
          <v-icon start>mdi-github</v-icon>
          這是專案本身:pepega:
        </v-btn>
      </div>

      <div class="socialLink">
        <v-btn
          href="https://github.com/peter910820"
          target="_blank"
          rel="noopener noreferrer"
          icon
          variant="text"
          size="large"
          @mouseover="isHoveredGithub = true"
          @mouseleave="isHoveredGithub = false"
        >
          <v-icon :class="{ 'icon-spin': isHoveredGithub }" size="32">mdi-github</v-icon>
        </v-btn>
        <v-btn
          href="https://x.com/seaotterMS"
          target="_blank"
          rel="noopener noreferrer"
          icon
          variant="text"
          size="large"
          @mouseover="isHoveredTwitter = true"
          @mouseleave="isHoveredTwitter = false"
        >
          <v-icon :class="{ 'icon-spin': isHoveredTwitter }" size="32" color="info">mdi-twitter</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-profile {
  min-height: 100vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  background-color: rgb(var(--v-theme-background));
}

.profile-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.headShot {
  max-height: 250px;
  max-width: 250px;
  height: 250px;
  width: 250px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgb(var(--v-theme-primary));
  border-radius: 50%;
  background-color: rgb(var(--v-theme-surface));

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.profile-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.myName {
  font-family: "Cubic_11_1.100_R", sans-serif;
  font-size: 28px;
  font-weight: bold;
  color: rgb(var(--v-theme-tagColor));
  text-align: center;

  &.not-logged-in {
    color: rgb(var(--v-theme-info));
  }
}

.aboutMe {
  font-size: 18px;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  text-align: center;
  color: #666;
  min-height: 60px;
  padding: 0 16px;
}

.project-link {
  width: 100%;
  margin: 16px 0;
}

.project-btn {
  border-radius: 50px !important;
  font-family: "Cubic_11_1.100_R", sans-serif;
}

.socialLink {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: auto;
  padding-bottom: 24px;

  :deep(.v-btn) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(.v-icon) {
    margin: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

:deep(.icon-spin) {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .my-profile {
    padding: 16px;
  }

  .headShot {
    max-height: 200px;
    max-width: 200px;
    height: 200px;
    width: 200px;
  }

  .myName {
    font-size: 24px;
  }

  .aboutMe {
    font-size: 16px;
  }
}
</style>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(async () => {
  const bar = document.getElementById("loader");
  if (bar) {
    setTimeout(() => {
      bar.classList.add("loading-hidden");
    }, 100);
  }
  // @ts-ignore
  if (window.WOW) {
    // @ts-ignore
    new WOW().init();
  }
});
</script>

<template>
  <v-app>
    <div id="loader">
      <div class="loader"></div>
    </div>
    <div class="sticky-navbar">
      <NavBar />
    </div>
    <v-container fluid class="page-container">
      <v-row class="page-row">
        <v-col cols="1"></v-col>
        <v-col cols="10" class="page-content">
          <NuxtPage />
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>
    </v-container>
    <!-- <MainFooter /> -->
  </v-app>
</template>

<style lang="scss">
html,
body {
  min-height: 100vh;
  min-width: 768px;

  background-color: rgb(var(--v-theme-background));
  background-size: 400% 400%;
}

.main-block {
  padding: 40px;
}

.sub-block {
  padding-top: 20px;
  margin-top: 10px;
  cursor: default;
  border: 2px solid rgb(var(--v-theme-border));
  border-radius: 20px;
  display: inline-block;
  word-wrap: break-word;
  word-break: break-word;
}

.sticky-navbar {
  position: sticky;
  top: 0px;
  z-index: 10;
}

.floatup-div {
  cursor: default;
}

.loading-hidden {
  display: none !important;
}

.page-container {
  min-height: 100vh;
}

.page-row {
  min-height: 100%;
}

.page-content {
  min-height: 100vh;
}
</style>

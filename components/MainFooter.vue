<script setup lang="ts"></script>

<template>
  <v-footer class="main-footer" app>
    <v-container>
      <v-row align="center" justify="space-between">
        <v-col cols="12" sm="6" class="text-center text-sm-left">
          <span class="footer-text">© 2024-2026 Copyright</span>
        </v-col>
        <v-col cols="12" sm="6" class="text-center text-sm-right">
          <a href="https://github.com/peter910820" target="_blank" class="footer-link"> Creater: SeaotterMS </a>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style lang="scss" scoped>
.main-footer {
  background-color: rgb(var(--v-theme-background)) !important;
  border-top: 2px solid rgb(var(--v-theme-border));
}

.footer-text {
  color: #444444;
  font-size: 0.875rem;
}

.footer-link {
  color: #444444;
  text-decoration: none;
  font-size: 0.875rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
}
</style>

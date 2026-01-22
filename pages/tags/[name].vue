<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

import type { ArticleQueryResponse, CommonResponse } from "@/types/response";

const route = useRoute();
const router = useRouter();

const tagName = route.params.name as string;

const { data, error } = await useFetch<CommonResponse<ArticleQueryResponse[]>, CommonResponse>(`tags/${tagName}`, {
  baseURL: import.meta.env.VITE_API_URL,
  credentials: "include",
});

const articles = computed(() => (data.value?.data ?? []) as ArticleQueryResponse[]);

if (import.meta.client && error.value) {
  if (error.value.statusCode === 500) {
    messageStorage(error.value.statusCode, error.value.errMsg);
    router.push("/message");
  } else {
    messageStorage();
    router.push("/message");
  }
}

const link = (articleID: number) => {
  router.push(`/articles/${articleID}`);
};
</script>

<template>
  <div class="main-block">
    <v-container>
      <h1 class="text-h4 mb-4">{{ tagName }}</h1>

      <v-row>
        <v-col v-for="article in articles" :key="article.id" cols="12" sm="6" md="6">
          <v-card class="article-item-card floatup-div" @click="link(article.id)">
            <v-card-text class="article-item-text">
              {{ article.title }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.main-block {
  padding: 40px;
}

.article-item-card {
  background-color: rgb(var(--v-theme-background));
  border: 2px solid rgb(var(--v-theme-border));
  border-radius: 50px;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.article-item-text {
  font-size: 20px;
  padding: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

h1 {
  font-family: "Cubic_11_1.100_R", sans-serif;
  font-size: 2rem;
  font-weight: bold;
}
</style>

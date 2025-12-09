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
  <div class="row main-block">
    <div class="col s12 tagBlock">
      <div class="col s12">
        <h1>{{ tagName }}</h1>
      </div>
      <div class="col s6" v-for="article in articles" :key="article.id">
        <div class="floatup-div wow animate__slideInUp" @click="link(article.id)">
          {{ article.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tagBlock {
  min-height: 200px;
  margin-top: 10px;
  padding: 25px;
  > div {
    min-height: 100%;
    padding: 10px;
    div {
      font-size: 20px;
      padding: 10px;
      border: 2px solid rgb(var(--v-theme-surface));
      border-radius: 50px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>

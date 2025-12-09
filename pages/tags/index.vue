<script setup lang="ts">
import { useRouter } from "vue-router";

import type { CommonResponse, TagQueryResponse } from "@/types/response";

const router = useRouter();

const { data, error } = await useFetch<CommonResponse<TagQueryResponse[]>, CommonResponse>("tags", {
  baseURL: import.meta.env.VITE_API_URL,
  credentials: "include",
});

const tags = computed(() => (data.value?.data ?? []) as TagQueryResponse[]);

if (import.meta.client && error.value) {
  if (error.value.statusCode === 500) {
    messageStorage(error.value.statusCode, error.value.errMsg);
    router.push("/message");
  } else {
    messageStorage();
    router.push("/message");
  }
}

const link = (tagName: string) => {
  router.push(`/tags/${tagName}`);
};
</script>

<template>
  <div class="row main-block">
    <h1>標籤一覽</h1>
    <div class="col s12 sub-block">
      <div class="col s6" v-for="Tag in tags" :key="Tag.name">
        <div class="button-flip floatup-div wow animate__slideInUp" @click="link(Tag.name)">
          <span>{{ Tag.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sub-block {
  min-height: 200px;
  margin-top: 10px;
  padding: 25px;
  > div {
    min-height: 200px;
    padding: 10px;
    div {
      min-height: 200px;
      font-size: 50px;
      text-align: center;
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

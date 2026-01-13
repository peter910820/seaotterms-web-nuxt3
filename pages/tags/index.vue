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
  <div class="main-block">
    <v-container>
      <h1 class="mb-4">標籤一覽</h1>

      <v-row>
        <v-col v-for="Tag in tags" :key="Tag.name" cols="12" sm="4" md="4">
          <v-card class="tag-card floatup-div" @click="link(Tag.name)">
            <v-card-text class="tag-text">
              {{ Tag.name }}
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

.tag-card {
  min-height: 100px;
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

.tag-text {
  min-height: 100px;
  font-size: 24px;
  text-align: center;
  padding: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
}
</style>

<script setup lang="ts">
definePageMeta({
  ssr: false,
  middleware: "require-auth",
});

import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { messageStorage } from "@/utils/messageHandler";
import { userInfoHandler } from "@/utils/userInfoHandler";

import type { TodoTopicCreateRequest } from "@/types/request";
import type { CommonResponse } from "@/types/response";
import { errorHandler } from "@/utils/errorHandler";

const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const form = ref<TodoTopicCreateRequest>({
  topicName: "",
  topicOwner: user.value.username,
  updatedAt: new Date(),
  updateName: user.value.username,
});

const loading = ref(false);
const titleRules = [(v: string) => !!v || "此欄不能為空"];

const handleSubmit = async () => {
  if (form.value.topicName.trim() === "") {
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch<CommonResponse>("todo-topics", {
      baseURL: import.meta.env.VITE_API_URL,
      method: "POST",
      body: form.value,
      credentials: "include",
    });
    userInfoHandler(response.userInfo);
    messageStorage(response.statusCode, "資料創建成功");
    router.push("/message");
  } catch (error) {
    errorHandler(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-container class="main-block">
    <h1 class="page-title mb-6">建立Todo主題</h1>
    <v-card class="form-card">
      <v-card-text class="pa-8">
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.topicName"
            label="Title"
            prepend-inner-icon="mdi-format-title"
            variant="outlined"
            required
            class="mb-6"
            density="comfortable"
            :rules="titleRules"
          />
          <v-btn
            color="primary"
            variant="elevated"
            size="large"
            :loading="loading"
            @click="handleSubmit"
            type="submit"
            block
          >
            建立主題
            <v-icon end>mdi-send</v-icon>
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
.main-block {
  min-height: 100vh;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.page-title {
  font-family: "Cubic_11_1.100_R", sans-serif;
  font-size: 2rem;
  font-weight: bold;
  color: rgb(var(--v-theme-tagColor));
}

.form-card {
  border: 2px solid rgb(var(--v-theme-border));
  border-radius: 20px;
  background-color: rgb(var(--v-theme-background));
  min-height: 200px;
}
</style>

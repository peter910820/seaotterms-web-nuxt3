<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { messageStorage } from "@/utils/messageHandler";
import { errorHandler } from "@/utils/errorHandler";
import { userInfoHandler } from "@/utils/userInfoHandler";

import type { TagCreateRequest } from "@/types/request";
import type { CommonResponse } from "@/types/response";

const router = useRouter();
const form = ref<TagCreateRequest>({
  name: "",
  iconName: "",
});

const loading = ref(false);
const formRef = ref();
const nameRules = [(v: string) => !!v || "此欄不能為空"];

const handleSubmit = async () => {
  // Prevent duplicate submission
  if (loading.value) {
    return;
  }

  // Validate form before submission
  const { valid } = await formRef.value.validate();
  if (!valid) {
    return;
  }

  // Additional validation check
  if (form.value.name.trim() === "") {
    alert("標題不得為空");
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch<CommonResponse>("tags", {
      baseURL: import.meta.env.VITE_API_URL,
      method: "POST",
      body: form.value,
      credentials: "include",
    });
    userInfoHandler(response.userInfo);
    messageStorage(response.statusCode, response.infoMsg);
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
    <h1 class="page-title mb-6">建立文章Tag</h1>
    <v-card class="form-card wow animate__flipInX">
      <v-card-text class="pa-8">
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            label="Name"
            prepend-inner-icon="mdi-format-title"
            variant="outlined"
            required
            class="mb-4"
            density="comfortable"
            :rules="nameRules"
          />

          <v-text-field
            v-model="form.iconName"
            label="Icon Name"
            prepend-inner-icon="mdi-tag"
            variant="outlined"
            class="mb-4"
            density="comfortable"
          />

          <v-btn color="primary" variant="elevated" size="large" :loading="loading" type="submit" block>
            建立文章Tag
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

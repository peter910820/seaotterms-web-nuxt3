<script setup lang="ts">
definePageMeta({
  ssr: false,
  middleware: "require-management",
});

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import { initMaterialDatepicker, initMaterialFormSelect, initMaterialDropdown } from "@/composables/useMaterial";

import { messageStorage } from "@/utils/messageHandler";
import { errorHandler } from "@/utils/errorHandler";
import { userInfoHandler } from "@/utils/userInfoHandler";

import type { SystemTodoUpdateRequest } from "@/types/request";
import type { CommonResponse, SystemTodoQueryResponse, TodoTopicQueryResponse } from "@/types/response";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const systemTodoId = route.params.id as string;

const { data, error } = await useFetch<CommonResponse<SystemTodoQueryResponse[]>, CommonResponse>(
  `system-todos?id=${systemTodoId}`,
  {
    baseURL: import.meta.env.VITE_API_URL,
    credentials: "include",
  },
);

const { data: data2, error: error2 } = await useFetch<CommonResponse<TodoTopicQueryResponse[]>, CommonResponse>(
  "todo-topics/system",
  {
    baseURL: import.meta.env.VITE_API_URL,
    credentials: "include",
  },
);

const systemTodo = data.value?.data as SystemTodoQueryResponse[] | undefined;
const systemTodoTopics = data2.value?.data as TodoTopicQueryResponse[] | undefined;

if (import.meta.client && (error.value || !systemTodo || systemTodo.length === 0)) {
  if (error.value?.statusCode === 500) {
    messageStorage(error.value.statusCode, error.value.errMsg);
  } else {
    messageStorage();
  }
  router.push("/message");
}

const form = ref<SystemTodoUpdateRequest>({
  id: systemTodo?.[0]?.id ?? 0,
  systemName: systemTodo?.[0]?.systemName ?? "",
  title: systemTodo?.[0]?.title ?? "",
  detail: systemTodo?.[0]?.detail ?? "",
  status: systemTodo?.[0]?.status ?? 0,
  deadline: systemTodo?.[0]?.deadline ? new Date(systemTodo[0].deadline).toISOString().slice(0, 10) : null,
  urgency: systemTodo?.[0]?.urgency ?? 0,
  updatedName: user.value.username,
});

onMounted(async () => {
  // init materializecss
  initMaterialDatepicker();
  initMaterialDropdown();
  initMaterialFormSelect();
});

const handleSubmit = async () => {
  const deadlineTag = document.getElementById("deadline") as HTMLInputElement | null;
  if (deadlineTag) {
    form.value.deadline = deadlineTag.value;
  } else {
    // 找不到ID為deadline的HTML元素
    messageStorage();
    router.push("/message");
    return;
  }
  if ((form.value.deadline ?? "").trim() !== "") {
    const dateStr = form.value.deadline + "T00:00:00Z";
    const timestamp = Date.parse(dateStr);

    if (isNaN(timestamp)) {
      alert("日期格式錯誤");
      return;
    }
    form.value.deadline = dateStr;
  } else {
    form.value.deadline = null;
  }
  if (form.value.title.trim() === "") {
    alert("請確保標題有正確填寫");
    return;
  }

  try {
    const response = await $fetch<CommonResponse>(`system-todos/${form.value.id}`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "PATCH",
      body: form.value,
      credentials: "include",
    });
    userInfoHandler(response.userInfo);
    messageStorage(response.statusCode, response.infoMsg);
    router.push("/message");
  } catch (error) {
    errorHandler(error);
  }
};
</script>

<template>
  <div class="row main-block">
    <h1>更新系統代辦</h1>
    <div class="col s12 sub-block wow animate__flipInX">
      <div class="row">
        <div class="col s4 input-field mobile-hidden">
          <select v-model="form.systemName">
            <option class="validate" value="" disabled selected>選擇站台</option>
            <option v-for="todoTopic in systemTodoTopics" :key="todoTopic.topicName" :value="todoTopic.topicName">
              {{ todoTopic.topicName }}
            </option>
          </select>
          <label>選擇站台</label>
        </div>
        <div class="col s4 input-field mobile-display">
          <select v-model="form.systemName" class="browser-default">
            <option class="validate" value="" disabled selected>選擇站台</option>
            <option v-for="todoTopic in systemTodoTopics" :key="todoTopic.topicName" :value="todoTopic.topicName">
              {{ todoTopic.topicName }}
            </option>
          </select>
        </div>
        <!-- title -->
        <div class="col s8 input-field">
          <input v-model="form.title" id="title" type="text" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="title">標題</label>
        </div>
        <div class="input-field col s12">
          <textarea v-model="form.detail" id="detail" class="materialize-textarea"></textarea>
          <label for="detail">詳細資訊</label>
        </div>
        <!-- urgency -->
        <div class="col s3 input-field mobile-hidden">
          <select v-model="form.urgency">
            <option class="validate" :value="0" selected>普通</option>
            <option class="validate" :value="1" selected>高優先度</option>
            <option class="validate" :value="2" selected>緊急</option>
          </select>
          <label>選擇急迫度</label>
        </div>
        <div class="col s3 input-field mobile-display">
          <select v-model="form.urgency" class="browser-default">
            <option class="validate" :value="0" selected>普通</option>
            <option class="validate" :value="1" selected>高優先度</option>
            <option class="validate" :value="2" selected>緊急</option>
          </select>
        </div>
        <!-- deadline -->
        <div class="col s7 input-field">
          <i class="material-icons prefix">browse_gallery</i>
          <input v-model="form.deadline" id="deadline" type="text" class="datepicker validate" />
          <label for="deadline">截止日期</label>
        </div>
        <div class="col s2 submit">
          <button class="button-submit" type="button" @click="handleSubmit">
            更新
            <i class="material-icons right">send</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sub-block {
  font-size: 25px !important;
  min-height: 400px;
}
</style>

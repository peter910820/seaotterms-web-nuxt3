<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userInfoHandler } from "@/utils/userInfoHandler";
import { messageStorage } from "@/utils/messageHandler";

import { initMaterialDatepicker, initMaterialFormSelect } from "@/composables/useMaterial";

import { useTodoTopicStore, useSystemTodoStore } from "@/stores/useTodoStore";

import type { CommonResponse, TodoTopicQueryResponse, SystemTodoQueryResponse } from "@/types/response";

const router = useRouter();
const todoTopicStore = useTodoTopicStore();
const systemTodoStore = useSystemTodoStore();
const filterValue = ref<string>("");
const filterStatus = ref<string>("");

const { data, error } = await useFetch<CommonResponse<TodoTopicQueryResponse[]>, CommonResponse>(`todo-topics/system`, {
  baseURL: import.meta.env.VITE_API_URL,
});

const todoTopics = computed(() => (data.value?.data ?? []) as TodoTopicQueryResponse[]);
todoTopicStore.set(todoTopics.value);

const startFilter = async () => {
  try {
    const response = await $fetch<CommonResponse<SystemTodoQueryResponse[]>>(
      `system-todos?system_name=${filterValue.value}&status=${filterStatus.value}`,
      {
        baseURL: import.meta.env.VITE_API_URL,
        method: "GET",
        credentials: "include",
      },
    );
    userInfoHandler(response.userInfo);
    systemTodoStore.set(response.data);
  } catch (error) {
    errorHandler(error);
  }
};

if (import.meta.client && error.value) {
  if (error.value.statusCode === 500) {
    messageStorage(error.value.statusCode, error.value.errMsg);
    router.push("/message");
  } else {
    messageStorage();
    router.push("/message");
  }
}

onMounted(() => {
  // init materializecss
  initMaterialDatepicker();
  initMaterialFormSelect();
});
</script>

<template>
  <!-- 嵌入其他頁面，所以不用寫main-block -->
  <div class="col s12 sub-block floatup-div">
    <div class="row">
      <div class="col s2">篩選器</div>
      <div class="col s2">
        <div class="input-field">
          <i class="material-icons prefix">text_fields</i>
          <input id="filterText" type="text" class="validate" />
          <label for="filterText">篩選文字</label>
        </div>
      </div>
      <div class="col s3">
        <div class="input-field">
          <i class="material-icons prefix">apartment</i>
          <select v-model="filterValue">
            <option class="validate" value="" disabled selected>請選擇站點</option>
            <option
              v-for="systemTodoTopic in todoTopics"
              :key="systemTodoTopic.topicName"
              :value="systemTodoTopic.topicName"
            >
              {{ systemTodoTopic.topicName }}
            </option>
          </select>
          <label>站點篩選</label>
        </div>
      </div>
      <div class="col s3">
        <div class="input-field">
          <i class="material-icons prefix">signal_cellular_alt</i>
          <select v-model="filterStatus">
            <option class="validate" value="" disabled selected>選擇狀態</option>
            <option value="0">未開始</option>
            <option value="1">進行中</option>
            <option value="2">擱置中</option>
            <option value="3">已完成</option>
          </select>
          <label>狀態篩選</label>
        </div>
      </div>
      <div class="col s2">
        <button class="button-submit" type="button" @click="startFilter">
          篩選
          <i class="material-icons right">send</i>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
%filter {
  display: flex;
  justify-content: center !important;
  align-items: center !important;
  height: 100%;
}

.sub-block {
  border: 2px solid rgb(var(--v-theme-surface));
  border-radius: 20px;
  font-size: 25px !important;
  max-height: 100px;
  height: 150px;
}

.sub-block {
  .row {
    height: 100%;
    .col {
      @extend %filter;
    }
  }
}
</style>

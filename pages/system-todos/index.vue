<script setup lang="ts">
import { computed, ref, nextTick } from "vue";

import FilterBlock from "@/components/FilterBlock.vue";
import { userInfoHandler } from "@/utils/userInfoHandler";
import { useSystemTodoStore } from "@/stores/useTodoStore";
import type { CommonResponse, SystemTodoQueryResponse } from "@/types/response";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    WOW: any;
  }
}
const router = useRouter();
const userStore = useUserStore();
const systemTodoStore = useSystemTodoStore();

const { user } = storeToRefs(userStore);
const { systemTodo, systemTodoSingle } = storeToRefs(systemTodoStore);

const modalVisible = ref(false);

const { data, error } = await useFetch<CommonResponse<SystemTodoQueryResponse[]>, CommonResponse>("system-todos", {
  baseURL: import.meta.env.VITE_API_URL,
  credentials: "include",
});

systemTodoStore.set(data.value?.data as SystemTodoQueryResponse[]);

const systemTodos = computed(() => systemTodo.value);

if (import.meta.client && error.value) {
  if (error.value.statusCode === 500) {
    messageStorage(error.value.statusCode, error.value.errMsg);
    router.push("/message");
  } else {
    messageStorage();
    router.push("/message");
  }
}

systemTodoStore.$subscribe(() => {
  nextTick(() => {
    const wow = new window.WOW();
    wow.sync();
    window.dispatchEvent(new Event("scroll"));
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openModal = async (id: number) => {
  // refresh user data and check login
  // refreshUserData();

  try {
    const response = await $fetch<CommonResponse<SystemTodoQueryResponse[]>>(`system-todos?id=${id}`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "GET",
      credentials: "include",
    });
    userInfoHandler(response.userInfo);
    systemTodoStore.setSingle(response.data);
  } catch (error) {
    errorHandler(error);
  }
  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
};

const changeStatus = async (id: number, status: number) => {
  let statusText = "";
  switch (status) {
    case 0:
      statusText = "未開始";
      break;
    case 1:
      statusText = "進行中";
      break;
    case 2:
      statusText = "擱置中";
      break;
    case 3:
      statusText = "已完成";
      break;
  }
  if (confirm(`確定調整狀態為${statusText}?`)) {
    await $fetch<CommonResponse<SystemTodoQueryResponse[]>>(`system-todos/quick/${id}`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "PATCH",
      credentials: "include",
      body: {
        status: status,
        updatedName: user.value.username,
      },
    });
    let response = await $fetch<CommonResponse<SystemTodoQueryResponse[]>>(`system-todos?id=${id}`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "GET",
    });
    systemTodoStore.setSingle(response.data);
    response = await $fetch<CommonResponse<SystemTodoQueryResponse[]>>(`system-todos`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "GET",
      credentials: "include",
    });
    userInfoHandler(response.userInfo);
    systemTodoStore.set(response.data);
  }
};

const goToEditPage = async (id: number) => {
  router.push(`/system-todos/${id}/edit`);
  return;
};

const deleteTodo = async (id: number) => {
  if (confirm("確定刪除?")) {
    // 原本沒處理錯誤，之後再調整
    await $fetch<CommonResponse<SystemTodoQueryResponse[]>>(`system-todos/${id}`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "DELETE",
      credentials: "include",
    });
    let response = await $fetch<CommonResponse<SystemTodoQueryResponse[]>>(`system-todos?id=${id}`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "GET",
      credentials: "include",
    });
    systemTodoStore.setSingle(response.data);
    response = await $fetch<CommonResponse<SystemTodoQueryResponse[]>>(`system-todos`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "GET",
      credentials: "include",
    });

    systemTodoStore.set(response.data);
  }
};
</script>

<template>
  <v-container class="main-block">
    <div class="d-flex align-center justify-space-between mb-4">
      <h1>系統更新待辦</h1>
      <v-btn v-if="user?.management === true" :to="'/system-todos/create'" class="button-simple" variant="flat">
        點我新增
      </v-btn>
    </div>

    <FilterBlock />

    <v-card
      v-for="systemTodo in systemTodos"
      :key="systemTodo.id"
      class="todo-card mb-3 floatup-div wow animate__slideInUp"
      :class="{
        'urgency-high': systemTodo.urgency === 1,
        'urgency-urgent': systemTodo.urgency === 2,
      }"
    >
      <v-card-text class="d-flex align-center pa-3">
        <v-row no-gutters align="center">
          <!-- Title -->
          <v-col :cols="systemTodo.deadline ? 6 : 9" class="todo-title">
            [{{ systemTodo.systemName }}]{{ systemTodo.title }}
          </v-col>

          <!-- Deadline -->
          <v-col v-if="systemTodo.deadline" cols="3" class="todo-date text-center">
            {{ new Date(systemTodo.deadline).toISOString().slice(0, 10) }}
          </v-col>

          <!-- Status -->
          <v-col :cols="systemTodo.deadline ? 2 : 2" class="todo-status text-right">
            <v-chip v-if="systemTodo.status === 0" color="error" size="small" variant="flat"> 未開始 </v-chip>
            <v-chip v-else-if="systemTodo.status === 1" color="info" size="small" variant="flat"> 進行中 </v-chip>
            <v-chip v-else-if="systemTodo.status === 2" color="tagColor" size="small" variant="flat"> 擱置中 </v-chip>
            <v-chip v-else-if="systemTodo.status === 3" color="success" size="small" variant="flat"> 已完成 </v-chip>
            <v-chip v-else size="small" variant="flat">?</v-chip>
          </v-col>

          <!-- Open Modal Button -->
          <v-col cols="1" class="text-center">
            <v-btn class="button-open-modal" size="small" variant="flat" @click="openModal(systemTodo.id)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>

  <!-- Vuetify Dialog -->
  <v-dialog v-model="modalVisible" max-width="75vw" scrollable>
    <v-card v-if="systemTodoSingle !== null" class="modal-content">
      <v-card-title class="text-h5">詳細資料</v-card-title>
      <v-card-text>
        <div class="mb-4">
          <h5 class="mb-2">備註</h5>
          <div class="modal-content-text">{{ systemTodoSingle.detail }}</div>
        </div>

        <div class="mb-4">
          <h5 class="mb-2">優先級</h5>
          <div class="modal-content-text" v-if="systemTodoSingle.urgency === 0">普通</div>
          <div class="modal-content-text orange-text" v-else-if="systemTodoSingle.urgency === 1">高優先度</div>
          <div class="modal-content-text red-text" v-else-if="systemTodoSingle.urgency === 2">緊急</div>
          <div class="modal-content-text" v-else>?</div>
        </div>

        <div v-if="user?.management">
          <h5 class="mb-2">管理員操作介面</h5>
          <div class="d-flex flex-wrap gap-2">
            <v-btn
              :class="['button-action', 'ma-1', systemTodoSingle.status == 0 ? 'button-active-n' : 'button-inactive']"
              size="default"
              variant="flat"
              @click="changeStatus(systemTodoSingle.id, 0)"
            >
              未開始
            </v-btn>
            <v-btn
              :class="['button-action', 'ma-1', systemTodoSingle.status == 1 ? 'button-active-p' : 'button-inactive']"
              size="default"
              variant="flat"
              @click="changeStatus(systemTodoSingle.id, 1)"
            >
              進行中
            </v-btn>
            <v-btn
              :class="['button-action', 'ma-1', systemTodoSingle.status == 2 ? 'button-active-s' : 'button-inactive']"
              size="default"
              variant="flat"
              @click="changeStatus(systemTodoSingle.id, 2)"
            >
              擱置中
            </v-btn>
            <v-btn
              :class="['button-action', 'ma-1', systemTodoSingle.status == 3 ? 'button-active-c' : 'button-inactive']"
              size="default"
              variant="flat"
              @click="changeStatus(systemTodoSingle.id, 3)"
            >
              已完成
            </v-btn>
            <v-btn
              class="button-action button-edit ma-1"
              size="default"
              variant="flat"
              prepend-icon="mdi-pencil"
              @click="goToEditPage(systemTodoSingle.id)"
            >
              編輯
            </v-btn>
            <v-btn
              class="button-action button-delete ma-1"
              size="default"
              variant="flat"
              prepend-icon="mdi-delete"
              @click="deleteTodo(systemTodoSingle.id)"
            >
              刪除
            </v-btn>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" @click="closeModal">關閉</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else class="modal-content">
      <v-card-text>
        <div class="text-error">查無資料，請聯繫管理員</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" @click="closeModal">關閉</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.main-block {
  padding: 40px;
}

.todo-card {
  border: 2px solid rgb(var(--v-theme-border));
  border-radius: 20px;
  background-color: rgb(var(--v-theme-background));
  font-size: 24px;
  min-height: 100px;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  &.urgency-high {
    .todo-title {
      color: rgb(255, 152, 0); // orange
    }
  }

  &.urgency-urgent {
    .todo-title {
      color: rgb(211, 47, 47); // red
    }
  }
}

@media (max-width: 768px) {
  .todo-card {
    font-size: 20px;
  }

  .todo-title,
  .todo-date,
  .todo-status {
    font-size: 20px !important;
  }

  .todo-status :deep(.v-chip) {
    font-size: 16px !important;
  }
}

.todo-title {
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 500;
  font-size: 24px !important;
}

.todo-date {
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: olive;
  font-size: 24px !important;
}

.todo-status {
  text-align: right;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 24px !important;

  :deep(.v-chip) {
    font-size: 18px !important;
    height: auto !important;
    padding: 6px 12px !important;
  }
}

.modal-content {
  max-height: 75vh;
  background: rgb(var(--v-theme-background));
}

.modal-content-text {
  font-size: 1.6rem;
  line-height: 1.8;
  word-wrap: break-word;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
}

h5 {
  color: #287be9;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.orange-text {
  color: rgb(255, 152, 0) !important;
}

.red-text {
  color: rgb(211, 47, 47) !important;
}

.background-n {
  background: linear-gradient(to bottom right, red, #ff2f13) !important;
  color: white !important;
}

.background-p {
  background: linear-gradient(to bottom right, blue, #287be9) !important;
  color: white !important;
}

.background-s {
  background: linear-gradient(to bottom right, purple, #9848f3) !important;
  color: white !important;
}

.background-c {
  background: linear-gradient(to bottom right, green, #35fc4f) !important;
  color: white !important;
}

.background-e {
  background: linear-gradient(to bottom right, skyblue, #79e5e9) !important;
  color: white !important;
}

.background-d {
  background: linear-gradient(to bottom right, black, #222121) !important;
  color: white !important;
}

/* Open Modal Button (+ button) */
.button-open-modal {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-info)) 100%) !important;
  color: white !important;
  border-radius: 50% !important;
  min-width: 40px !important;
  width: 40px !important;
  height: 40px !important;
  padding: 0 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s ease !important;

  &:hover {
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25) !important;
  }

  &:active {
    transform: scale(0.95);
  }

  :deep(.v-icon) {
    font-size: 24px;
  }
}

/* Dialog Action Buttons */
.button-action {
  border-radius: 8px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  min-width: 100px !important;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
  }

  &:active {
    transform: translateY(0);
  }
}

.button-inactive {
  background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%) !important;
  color: #424242 !important;
  border: 2px solid transparent !important;

  &:hover {
    background: linear-gradient(135deg, #bdbdbd 0%, #9e9e9e 100%) !important;
    color: #212121 !important;
  }
}

.button-active-n {
  background: linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%) !important;
  color: white !important;
  border: 2px solid transparent !important;
}

.button-active-p {
  background: linear-gradient(135deg, #4a90e2 0%, #5ba3f5 100%) !important;
  color: white !important;
  border: 2px solid transparent !important;
}

.button-active-s {
  background: linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%) !important;
  color: white !important;
  border: 2px solid transparent !important;
}

.button-active-c {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%) !important;
  color: white !important;
  border: 2px solid transparent !important;
}

.button-edit {
  background: linear-gradient(135deg, #00bcd4 0%, #4dd0e1 100%) !important;
  color: white !important;
  border: 2px solid transparent !important;
}

.button-delete {
  background: linear-gradient(135deg, #424242 0%, #616161 100%) !important;
  color: white !important;
  border: 2px solid transparent !important;

  &:hover {
    background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%) !important;
  }
}
</style>

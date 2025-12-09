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
  <div class="row main-block">
    <h1>
      系統更新待辦
      <router-link v-if="user?.management === true" to="/system-todos/create" class="button-simple"
        >點我新增</router-link
      >
    </h1>
    <FilterBlock />
    <div
      class="col s12 sub-block floatup-div wow animate__slideInUp"
      v-for="systemTodo in systemTodos"
      :key="systemTodo.id"
    >
      <div v-if="systemTodo.urgency === 0" :class="['col', systemTodo.deadline ? 's6' : 's9', 'todo-title']">
        [{{ systemTodo.systemName }}]{{ systemTodo.title }}
      </div>
      <div
        v-if="systemTodo.urgency === 1"
        :class="['col', systemTodo.deadline ? 's6' : 's9', 'todo-title', 'orange-text']"
      >
        [{{ systemTodo.systemName }}]{{ systemTodo.title }}
      </div>
      <div
        v-if="systemTodo.urgency === 2"
        :class="['col', systemTodo.deadline ? 's6' : 's9', 'todo-title', 'red-text']"
      >
        [{{ systemTodo.systemName }}]{{ systemTodo.title }}
      </div>

      <div v-if="systemTodo.deadline" class="col s3 todo-date">
        {{ new Date(systemTodo.deadline).toISOString().slice(0, 10) }}
      </div>

      <div v-if="systemTodo.status === 0" :class="['col', systemTodo.deadline ? 's2' : 's2', 'todo-status']">
        <font color="red">未開始</font>
      </div>
      <div v-else-if="systemTodo.status === 1" :class="['col', systemTodo.deadline ? 's2' : 's2', 'todo-status']">
        <font color="blue">進行中</font>
      </div>
      <div v-else-if="systemTodo.status === 2" :class="['col', systemTodo.deadline ? 's2' : 's2', 'todo-status']">
        <font color="purple">擱置中</font>
      </div>
      <div v-else-if="systemTodo.status === 3" :class="['col', systemTodo.deadline ? 's2' : 's2', 'todo-status']">
        <font color="green">已完成</font>
      </div>
      <div v-else class="col s2 todo-status">?</div>
      <div class="col s1">
        <span class="button-status" @click="openModal(systemTodo.id)">+</span>
      </div>
    </div>
  </div>

  <!-- 全螢幕彈出視窗 -->
  <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
    <div v-if="systemTodoSingle !== null" class="modal-content" @click.stop>
      <h4>詳細資料</h4>
      <h5 class="left-align">備註</h5>
      <div class="col s12 left-align">{{ systemTodoSingle.detail }}</div>
      <h5 class="left-align">優先級</h5>
      <div v-if="systemTodoSingle.urgency === 0" class="col s12 left-align">普通</div>
      <div v-else-if="systemTodoSingle.urgency === 1" class="col s12 left-align orange-text">高優先度</div>
      <div v-else-if="systemTodoSingle.urgency === 2" class="col s12 left-align red-text">緊急</div>
      <div v-else class="col s12 left-align">?</div>
      <!-- todo-button -->
      <h5 v-if="user?.management" class="left-align">管理員操作介面</h5>
      <div v-if="user?.management" class="col s12 todo-button left-align">
        <span
          :class="['button-status', systemTodoSingle.status == 0 ? 'background-n' : '']"
          @click="changeStatus(systemTodoSingle.id, 0)"
        >
          N
        </span>
        <span
          :class="['button-status', systemTodoSingle.status == 1 ? 'background-p' : '']"
          @click="changeStatus(systemTodoSingle.id, 1)"
        >
          P
        </span>
        <span
          :class="['button-status', systemTodoSingle.status == 2 ? 'background-s' : '']"
          @click="changeStatus(systemTodoSingle.id, 2)"
        >
          S
        </span>
        <span
          :class="['button-status', systemTodoSingle.status == 3 ? 'background-c' : '']"
          @click="changeStatus(systemTodoSingle.id, 3)"
        >
          C
        </span>
        <span class="button-status background-e" @click="goToEditPage(systemTodoSingle.id)">修</span>
        <span class="button-status background-d" @click="deleteTodo(systemTodoSingle.id)">D</span>
      </div>
    </div>
    <div v-else class="modal-content" @click.stop>
      <font color="red">查無資料，請聯繫管理員</font>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sub-block {
  font-size: 25px !important;
  max-height: 100px;
  height: 150px;
}
@media (max-width: 768px) {
  .sub-block {
    font-size: 20px !important;
    max-height: 100px;
    height: 150px;
  }
}
.todo-title {
  text-align: left;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
}
.todo-date {
  text-align: center;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  color: olive;
}
.todo-status {
  text-align: right;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  height: 75vh;
  width: 75vw;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgb(var(--v-theme-background));
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
h5 {
  color: #287be9;
}

.background-n {
  background: linear-gradient(to bottom right, red, #ff2f13);
}
.background-p {
  background: linear-gradient(to bottom right, blue, #287be9);
}
.background-s {
  background: linear-gradient(to bottom right, purple, #9848f3);
}
.background-c {
  background: linear-gradient(to bottom right, green, #35fc4f);
}
.background-e {
  background: linear-gradient(to bottom right, skyblue, #79e5e9);
}
.background-d {
  background: linear-gradient(to bottom right, black, #222121);
}
</style>

<script setup lang="ts">
definePageMeta({
  ssr: false,
  middleware: "require-auth",
});

import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { errorHandler } from "@/utils/errorHandler";
import { messageStorage } from "@/utils/messageHandler";

import type { TodoCreateRequest } from "@/types/request";
import type { CommonResponse, TodoQueryResponse, TodoTopicQueryResponse } from "@/types/response";

const router = useRouter();
const todoTopicStore = useTodoTopicStore();
const { todoTopic } = storeToRefs(todoTopicStore);
const todoStore = useTodoStore();
const { todo } = storeToRefs(todoStore);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const form = ref<TodoCreateRequest>({
  owner: user.value.username,
  topic: "",
  title: "",
  status: 0,
  deadline: null,
  createName: user.value.username,
  updateName: "",
});

const deadlineDate = ref<string>("");
const loading = ref(false);

const todos = computed(() => todo.value);
const todoTopics = computed(() => todoTopic.value);

const todoTopicItems = computed(() => {
  return todoTopics.value.map((topic) => ({
    title: topic.topicName,
    value: `${topic.topicName}/${form.value.owner}`,
  }));
});

// Get todo topics
const { data: todoTopicsData, error: todoTopicsError } = await useFetch<CommonResponse<TodoTopicQueryResponse[]>>(
  `todo-topics/${user.value.username}`,
  {
    baseURL: import.meta.env.VITE_API_URL,
    credentials: "include",
  },
);

if (todoTopicsData.value) {
  todoTopicStore.set(todoTopicsData.value.data);
} else if (import.meta.client && todoTopicsError.value) {
  messageStorage();
  router.push("/message");
}

// Get todos
const { data: todosData, error: todosError } = await useFetch<CommonResponse<TodoQueryResponse[]>>(
  `todos/${user.value.username}`,
  {
    baseURL: import.meta.env.VITE_API_URL,
    credentials: "include",
  },
);

if (todosData.value) {
  todoStore.set(todosData.value.data);
} else if (import.meta.client && todosError.value) {
  messageStorage();
  router.push("/message");
}

// Create
const handleSubmit = async () => {
  if (deadlineDate.value) {
    form.value.deadline = new Date(deadlineDate.value);
  } else {
    form.value.deadline = null;
  }

  if (form.value.topic.trim() === "" || form.value.title.trim() === "") {
    alert("請確保主題以及標題有正確填寫");
    return;
  }

  if (!confirm("確定新增?")) {
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch<CommonResponse<TodoQueryResponse[]>>(`todos`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "POST",
      credentials: "include",
      body: form.value,
    });
    todoStore.set(response.data);
    // Reset form
    form.value.topic = "";
    form.value.title = "";
    deadlineDate.value = "";
    form.value.owner = user.value.username;
  } catch (error) {
    errorHandler(error);
  } finally {
    loading.value = false;
  }
};

// Update
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
    try {
      const response = await $fetch<CommonResponse<TodoQueryResponse[]>>(`todos/${id}`, {
        baseURL: import.meta.env.VITE_API_URL,
        method: "PATCH",
        credentials: "include",
        body: {
          status: status,
          updateName: user.value.username,
        },
      });
      todoStore.set(response.data);
    } catch (error) {
      errorHandler(error);
    }
  }
};

// Delete
const deleteTodo = async (id: number) => {
  if (confirm("確定刪除?")) {
    try {
      const response = await $fetch<CommonResponse<TodoQueryResponse[]>>(`todos/${id}`, {
        baseURL: import.meta.env.VITE_API_URL,
        method: "DELETE",
        credentials: "include",
      });
      todoStore.set(response.data);
    } catch (error) {
      errorHandler(error);
    }
  }
};
</script>

<template>
  <v-container class="main-block">
    <div class="d-flex align-center justify-space-between mb-4">
      <h1>待辦清單</h1>
    </div>

    <div class="hint mb-4">*按鈕切換狀態>> N: 未開始 P: 進行中 S: 擱置中 C: 已完成 D: 刪除</div>

    <v-card class="add-block mb-4 wow animate__slideInUp">
      <v-card-text class="pa-4">
        <v-row align="center" no-gutters>
          <v-col cols="12" sm="2" class="mb-2 mb-sm-0 px-1">
            <v-select
              v-model="form.topic"
              :items="todoTopicItems"
              item-title="title"
              item-value="value"
              label="選擇主題"
              placeholder="選擇主題"
              prepend-inner-icon="mdi-folder"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="5" class="mb-2 mb-sm-0 px-1">
            <v-text-field
              v-model="form.title"
              label="標題"
              prepend-inner-icon="mdi-format-title"
              variant="outlined"
              density="compact"
              hide-details
              :rules="[(v) => !!v || '此欄不能為空']"
            />
          </v-col>
          <v-col cols="12" sm="3" class="mb-2 mb-sm-0 px-1">
            <v-text-field
              v-model="deadlineDate"
              label="截止日期"
              type="date"
              prepend-inner-icon="mdi-calendar"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="2" class="text-center px-1">
            <v-btn
              color="primary"
              variant="elevated"
              :loading="loading"
              @click="handleSubmit"
              block
              class="button-submit"
            >
              新增
              <v-icon end>mdi-send</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card v-for="todo in todos" :key="todo.id" class="todo-card mb-3 floatup-div wow animate__slideInUp">
      <v-card-text class="d-flex align-center pa-3">
        <v-row no-gutters align="center">
          <!-- Title -->
          <v-col :cols="todo.deadline ? 5 : 7" class="todo-title"> [{{ todo.topic }}]{{ todo.title }} </v-col>

          <!-- Deadline -->
          <v-col v-if="todo.deadline" cols="2" class="todo-deadline text-center">
            {{ new Date(todo.deadline).toISOString().split("T")[0] }}
          </v-col>

          <!-- Status Buttons -->
          <v-col :cols="todo.deadline ? 3 : 3" class="todo-button">
            <div class="d-flex gap-1">
              <v-btn
                :class="['button-status', todo.status == 0 ? 'background-n' : '']"
                size="small"
                variant="flat"
                @click="changeStatus(todo.id, 0)"
              >
                N
              </v-btn>
              <v-btn
                :class="['button-status', todo.status == 1 ? 'background-p' : '']"
                size="small"
                variant="flat"
                @click="changeStatus(todo.id, 1)"
              >
                P
              </v-btn>
              <v-btn
                :class="['button-status', todo.status == 2 ? 'background-s' : '']"
                size="small"
                variant="flat"
                @click="changeStatus(todo.id, 2)"
              >
                S
              </v-btn>
              <v-btn
                :class="['button-status', todo.status == 3 ? 'background-c' : '']"
                size="small"
                variant="flat"
                @click="changeStatus(todo.id, 3)"
              >
                C
              </v-btn>
              <v-btn class="button-status background-d" size="small" variant="flat" @click="deleteTodo(todo.id)">
                D
              </v-btn>
            </div>
          </v-col>

          <!-- Status Display -->
          <v-col :cols="todo.deadline ? 2 : 2" class="todo-status text-right">
            <v-chip v-if="todo.status === 0" color="error" size="small" variant="flat">未開始</v-chip>
            <v-chip v-else-if="todo.status === 1" color="info" size="small" variant="flat">進行中</v-chip>
            <v-chip v-else-if="todo.status === 2" color="tagColor" size="small" variant="flat">擱置中</v-chip>
            <v-chip v-else-if="todo.status === 3" color="success" size="small" variant="flat">已完成</v-chip>
            <v-chip v-else size="small" variant="flat">?</v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
.main-block {
  padding: 40px;
}

h1 {
  font-family: "Cubic_11_1.100_R", sans-serif;
  font-size: 2rem;
  font-weight: bold;
  color: rgb(var(--v-theme-tagColor));
}

.hint {
  color: rgb(var(--v-theme-error));
  font-size: 1rem;
}

.add-block {
  border: 2px solid rgb(var(--v-theme-border));
  border-radius: 20px;
  background-color: rgb(var(--v-theme-background));
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
}

.todo-title {
  text-align: left;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  font-size: 24px !important;
}

.todo-button {
  padding: 0;
  text-align: left;
}

.todo-deadline {
  text-align: center;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  color: #808000;
  font-size: 24px !important;
}

.todo-status {
  text-align: right;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}

.button-status {
  min-width: 40px !important;
  width: 40px !important;
  height: 40px !important;
  padding: 0 !important;
  color: white !important;
  font-weight: bold !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%) !important;

  &:hover {
    transform: scale(1.1);
  }
}

.background-n {
  background: linear-gradient(135deg, red 0%, #ff2f13 100%) !important;
}

.background-p {
  background: linear-gradient(135deg, blue 0%, #287be9 100%) !important;
}

.background-s {
  background: linear-gradient(135deg, purple 0%, #9848f3 100%) !important;
}

.background-c {
  background: linear-gradient(135deg, green 0%, #35fc4f 100%) !important;
}

.background-d {
  background: linear-gradient(135deg, black 0%, #222121 100%) !important;

  &:hover {
    background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%) !important;
  }
}

:deep(.v-btn--variant-elevated.button-submit) {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}

@media (max-width: 768px) {
  .todo-card {
    font-size: 20px;
  }

  .todo-title,
  .todo-deadline,
  .todo-status {
    font-size: 20px !important;
  }

  .todo-status :deep(.v-chip) {
    font-size: 16px !important;
  }

  .hint {
    font-size: 0.875rem;
  }
}
</style>

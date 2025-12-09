<script setup lang="ts">
definePageMeta({
  ssr: false,
  middleware: "require-auth",
});

import { ref } from "vue";
import { useRouter } from "vue-router";
import { messageStorage } from "@/utils/messageHandler";

import type { CommonResponse, UserQueryResponse } from "@/types/response";
import type { UserUpdateRequest } from "@/types/request";

const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const form = ref<UserUpdateRequest>({
  id: user.value.id,
  username: user.value.username,
  email: user.value.email,
  exp: user.value.exp,
  management: user.value.management,
  created_at: user.value.created_at,
  updated_at: user.value.updated_at,
  update_name: user.value.update_name,
  avatar: user.value.avatar,
});
const allUserData = ref<UserQueryResponse[]>([]);

onMounted(() => {
  initMaterialModal();
});

const changeStatus = async () => {
  try {
    const response = await $fetch<CommonResponse<UserQueryResponse[]>>(`users`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "GET",
      credentials: "include",
    });
    allUserData.value = (response.data as UserQueryResponse[]).filter((val) => val.username !== user.value.username);
    userInfoHandler(response.userInfo);
  } catch (error) {
    console.log(error);
    errorHandler(error);
  }
};

const handleSubmit = async () => {
  try {
    const response = await $fetch<CommonResponse>(`users/${form.value.id}`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "PATCH",
      body: form.value,
      credentials: "include",
    });
    messageStorage(response.statusCode, response.infoMsg);
    userInfoHandler(response.userInfo);
    router.push("/message");
  } catch (error) {
    errorHandler(error);
  }
};

const changeManagementStatus = async (userId: number) => {
  if (confirm("確定修改權限?")) {
    const myUser = allUserData.value.find((item) => item.id === userId);
    if (myUser) {
      try {
        myUser.management = !myUser.management;
        myUser.updateName = user.value.update_name;
        const response = await $fetch<CommonResponse<UserQueryResponse[]>>(`users/${userId}`, {
          baseURL: import.meta.env.VITE_API_URL,
          method: "PATCH",
          body: myUser,
          credentials: "include",
        });
        allUserData.value = (response.data as UserQueryResponse[]).filter(
          (val) => val.username !== user.value.username,
        );
        userInfoHandler(response.userInfo);
      } catch (error) {
        errorHandler(error);
      }
    } else {
      errorHandler(null);
    }
  }
};
</script>

<template>
  <div class="row main-block">
    <h1>使用者帳號維護</h1>
    <div class="col s12 sub-block floatup-div wow animate__flipInX">
      <div class="row">
        <div class="col s6 title">
          使用者名稱:
          <span>{{ form.username }}</span>
        </div>
        <div class="col s6 title">
          身分:
          <span v-if="form.management">管理員</span>
          <span v-else>一般用戶</span>
          <button
            v-if="form.management"
            data-target="modal1"
            class="modal-trigger button-management"
            @click="changeStatus()"
          >
            變更使用者權限
          </button>
        </div>
        <div class="col s12 input-field">
          <i class="material-icons prefix">sports_esports</i>
          <input
            id="avatar"
            v-model="form.avatar"
            type="text"
            :class="['validate', form.avatar.length > 0 ? 'valid' : 'invalid']"
            required
          />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="avatar" :class="[form.avatar.length > 0 ? 'active' : '']">個人圖片URL</label>
        </div>
        <div class="col s12 center">
          <span>圖片預覽:</span>
          <div class="headShot">
            <img :src="form.avatar" />
          </div>
        </div>
        <div class="col s12 center">
          <button class="button-submit" type="button" @click="handleSubmit">
            確定修改
            <i class="material-icons right">send</i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Structure -->
  <div id="modal1" class="modal modal-fixed-footer">
    <div class="modal-content">
      <h4>使用者管理</h4>
      <div class="col s12 user-header">
        <div class="col s6">使用者名稱</div>
        <div class="col s6">權限</div>
      </div>
      <div class="col s12 user-conent floatup-div" v-for="user in allUserData" :key="user.id">
        <div class="col s6">{{ user.username }}</div>
        <div class="col s6">
          <button
            class="button-simple"
            v-if="user.management"
            @click="changeManagementStatus(user.id)"
            :disabled="user.username === 'root'"
          >
            管理員
          </button>
          <button
            class="button-simple"
            v-else
            @click="changeManagementStatus(user.id)"
            :disabled="user.username === 'root'"
          >
            使用者
          </button>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="modal-close waves-effect waves-green btn-flat">關閉</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sub-block {
  min-height: 550px;
  height: auto;
  div {
    margin-top: 20px;
  }
  > .title {
    font-size: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.modal-content {
  padding: 30px;
  > div {
    margin-top: 10px;
    padding: 10px;
  }
}

.modal,
.modal-footer {
  text-align: center;
  background-color: rgb(var(--v-theme-background));
}

.modal-close {
  width: 100%;
}

.user-header {
  text-align: center;
  font-size: x-large;
  font-weight: bold;
  max-height: 80px;
  height: 80px;
}
.user-conent {
  text-align: center;
  max-height: 100%;
  border: 2px solid rgb(var(--v-theme-surface));
  border-radius: 20px;
  > div {
    font-size: x-large;
    margin-left: 5px;
    padding: 0px;
    max-height: 100%;
    > button {
      padding: 0px !important;
      height: 30px;
      max-height: 30px;
      font-size: 20px;
    }
  }
}

.headShot {
  margin: 0 auto; // 萬能置中！
  max-height: 200px;
  max-width: 200px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed orange;
  border-radius: 100%;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

span {
  font-size: 30px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

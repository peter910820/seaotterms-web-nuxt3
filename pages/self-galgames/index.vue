<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { flattenUserGameErogs } from "@/utils/utils";

import type { CommonResponse, GameRecordQueryResponse, KuroHelperAPIOK, UserGameErogs } from "@/types/response";

import type { UserGameErogsFlat } from "@/types/common";

let total = ref(0);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const userData = computed(() => user.value);

const router = useRouter();

const { data, error } = await useFetch<KuroHelperAPIOK<UserGameErogs[]>, CommonResponse>(
  `userdata?id=${import.meta.env.VITE_SELF_DISCORD_ID}`,
  {
    baseURL: import.meta.env.VITE_KUROHELPER_API_URL,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_KUROHELPER_API_TOKEN}`,
    },
  },
);

if (import.meta.client && error.value) {
  if (error.value.statusCode === 500) {
    messageStorage(error.value.statusCode, error.value.errMsg);
    router.push("/message");
  } else {
    messageStorage();
    router.push("/message");
  }
}

const flattenedRecordList: UserGameErogsFlat[] = data.value?.data ? data.value.data.map(flattenUserGameErogs) : [];

let sortedFlattenedRecordList = flattenedRecordList.sort((a, b) => {
  const aTime = a.completedAt ? new Date(a.completedAt).getTime() : new Date(a.createdAt).getTime();
  const bTime = b.completedAt ? new Date(b.completedAt).getTime() : new Date(b.createdAt).getTime();

  return bTime - aTime; // DESC 排序
});

sortedFlattenedRecordList = sortedFlattenedRecordList.filter((item) => item.hasPlayed);

total.value = sortedFlattenedRecordList.length;

const formatDate = (date: string) => dayjs(date).format("YYYY-MM-DD");
</script>

<template>
  <div class="row main-block">
    <div class="col s12 center-align galgameBrandTitle">
      <div class="col s12">海獺的Galgame遊玩紀錄</div>
    </div>
    <div class="col s12 galgameBrandHeader">
      <div class="col s5">ゲーム</div>
      <div class="col s3">ブランド</div>
      <div class="col s2">遊玩結束時間</div>
      <div class="col s2">批評空間網址</div>
    </div>
    <div class="col s12 galgameBrandHeader">
      <div class="col s5"></div>
      <div class="col s3">攻略總數: {{ total }}</div>
      <div class="col s2"></div>
      <div class="col s2"></div>
    </div>
    <div
      class="col s12 galgameBrand floatup-div wow animate__slideInUp"
      v-for="game in sortedFlattenedRecordList"
      :key="game.userId"
    >
      <div class="col s5 game">{{ game.gameName }}</div>
      <div class="col s3">{{ game.brandName }}</div>
      <div class="col s2">
        {{
          game.completedAt === null || game.completedAt === undefined
            ? formatDate(game.createdAt)
            : formatDate(game.completedAt)
        }}
      </div>
      <div class="col s2 rainbow-text">
        <a :href="`https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=${game.gameErogsId}`">{{
          game.gameErogsId
        }}</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.col {
  max-height: 50px;
  height: 50px;
  margin-top: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.galgameBrandTitle {
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  max-height: 100px;
  height: 100px;
  > .col {
    padding: 0px;
    margin: 0px;
    min-height: 100%;
  }
}
.galgameBrandHeader {
  text-align: center;
  font-size: x-large;
  font-weight: bold;
  max-height: 80px;
  height: 80px;
}
.galgameBrand {
  text-align: center;
  max-height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.3);
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
.game {
  font-weight: bold;
}
.modify {
  height: 30px;
  width: 40px;
}
.details {
  max-height: 200px;
  height: 200px;
}
td {
  font-size: large;
}
a {
  color: black !important;
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
  padding: 40px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>

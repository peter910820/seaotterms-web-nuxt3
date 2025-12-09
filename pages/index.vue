<script lang="ts" setup>
import type { CommonResponse, ArticleQueryResponse } from "@/types/response";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Typed: any;

const router = useRouter();

const { data, error } = await useFetch<CommonResponse<ArticleQueryResponse[]>, CommonResponse>("articles", {
  baseURL: import.meta.env.VITE_API_URL,
  credentials: "include",
});

const articles = computed(() => (data.value?.data ?? []) as ArticleQueryResponse[]);

if (import.meta.client && error.value) {
  if (error.value.statusCode === 500) {
    messageStorage(error.value.statusCode, error.value.errMsg);
    router.push("/message");
  } else {
    messageStorage();
    router.push("/message");
  }
}

const link = (mod: string, target: string) => {
  if (mod === "article") {
    router.push(`/articles/${target}`);
  } else {
    router.push(`./tags/${target}`);
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tagClick = (tag: string, event: any) => {
  event.stopPropagation();
  link("tag", tag);
};

onMounted(() => {
  // eslint-disable-next-line no-undef
  new Typed(".banner>div>div", {
    strings: ["正在嘗試進步，", "學很多怪技術跟做很多小東西。"],
    typeSpeed: 80,
    loop: true,
    showCursor: false,
  });
});
</script>

<template>
  <div class="row main-block">
    <div class="col s12 sub-block banner wow animate__flipInX">
      <div><div></div></div>
    </div>
    <h1>首頁/文章</h1>
    <div
      class="col s12 sub-block articles floatup-div wow animate__slideInUp"
      v-for="article in articles"
      :key="article.id"
      @click="link('article', article.id.toString())"
    >
      <div class="title">{{ article.title }}</div>
      <div class="username">
        <i class="material-icons">person</i>
        SeaotterMS
      </div>
      <div class="information">
        <i class="material-icons">edit</i>
        {{ article.createdAt }}
        <i class="material-icons">update</i>
        {{ article.updatedAt }}
      </div>
      <div class="tag">
        <div class="button-paper" v-for="tag in article.tags" :key="tag.name" @click="tagClick(tag.name, $event)">
          {{ tag.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
%basic-text-style {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.sub-block {
  max-height: 180px;
  height: 180px;
}

.banner {
  min-height: 250px;
  max-height: 250px;
  border: 2px solid rgb(var(--v-theme-surface));
  border-radius: 100px;
  margin-bottom: 20px;
  text-align: center;
  background-image: var(--v-banner-image);
  background-size: cover;
  background-position: 50% 20%;
  position: relative;
  > div {
    min-height: 100%;
    max-height: 100%;
    border: 2px solid transparent;
    border-radius: 100px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: rgba(240, 248, 255, 0.5);
    > div {
      font-family: "ChenYuluoyan-Thin";
      min-height: 100%;
      max-height: 100%;
      margin: 50px;
      word-wrap: break-word;
      font-size: 60px;
    }
  }
}

.articles {
  border: 2px solid rgb(var(--v-theme-surface));
  border-radius: 20px;
}
.title {
  @extend %basic-text-style;
  font-size: 30px;
}
.information {
  @extend %basic-text-style;
}
.tag {
  @extend %basic-text-style;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  > div {
    margin-left: 5px;
  }
}
</style>

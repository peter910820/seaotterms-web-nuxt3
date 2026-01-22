<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";

import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // highlight-styles

import type { CommonResponse, ArticleQueryResponse } from "@/types/response";

const router = useRouter();
const route = useRoute();

const articleId = route.params.id as string;

const { data, error } = await useFetch<CommonResponse<ArticleQueryResponse[]>, CommonResponse>(
  `articles/${articleId}`,
  {
    baseURL: import.meta.env.VITE_API_URL,
    credentials: "include",
  },
);

const article = computed(() => (data.value?.data[0] ?? undefined) as ArticleQueryResponse);

if (import.meta.client && error.value) {
  if (error.value.statusCode === 500) {
    messageStorage(error.value.statusCode, error.value.errMsg);
    router.push("/message");
  } else {
    messageStorage();
    router.push("/message");
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderMarkdown = (content: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const md: any = MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            '<pre><code class="hljs">' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            "</code></pre>"
          );
        } catch (error) {
          console.log(error);
        }
      }

      return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + "</code></pre>";
    },
  });
  return md.render(content);
};

const renderedMarkdown = computed(() => renderMarkdown(article.value.content));

const formatDateTime = (date: string | Date) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};

const link = (tagName: string) => {
  router.push(`/tags/${tagName}`);
};
</script>

<template>
  <v-container class="article-container">
    <v-card class="article-banner mb-4">
      <v-card-title class="article-title text-h4">
        {{ article.title }}
      </v-card-title>

      <v-card-text>
        <div class="d-flex align-center flex-wrap mb-2">
          <v-icon size="small" class="mr-2">mdi-account-circle</v-icon>
          <span class="mr-4">SeaotterMS</span>
          <v-icon size="small" class="mr-2">mdi-calendar-plus</v-icon>
          <span class="mr-4">{{ formatDateTime(article.createdAt) }}</span>
          <v-icon size="small" class="mr-2">mdi-pencil</v-icon>
          <span>{{ formatDateTime(article.updatedAt) }}</span>
        </div>

        <div class="article-tags">
          <v-chip
            v-for="(tag, index) in article.tags"
            :key="index"
            class="ma-1"
            color="tagColor"
            variant="flat"
            size="small"
            @click="link(tag.name)"
            style="cursor: pointer"
          >
            {{ tag.name }}
          </v-chip>
        </div>
      </v-card-text>
    </v-card>

    <v-card class="article-content">
      <v-card-text>
        <div class="markdown-preview" v-html="renderedMarkdown"></div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
.article-container {
  padding: 40px;
}

.article-banner {
  min-height: 200px;
  background-color: rgb(var(--v-theme-background));
  border: 2px solid rgb(var(--v-theme-border));
  border-radius: 20px;
}

.article-title {
  font-family: "Cubic_11_1.100_R", sans-serif;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  color: rgb(var(--v-theme-tagColor));
  padding-bottom: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 8px;
}

.article-content {
  min-height: 500px;
  font-family: "jf-openhuninn-2.1";
  background-color: rgb(var(--v-theme-background));
  border: 2px solid rgb(var(--v-theme-border));
  border-radius: 20px;
}

.markdown-preview {
  min-height: 500px;
}
</style>

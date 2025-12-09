<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";

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

const link = (tagName: string) => {
  router.push(`/tags/${tagName}`);
};
</script>

<template>
  <div class="row banner">
    <div class="articleTitle">
      <h1>{{ article.title }}</h1>
    </div>
    <div class="articleInformation">
      <i class="material-icons">account_circle</i>
      SeaotterMS
      <i class="material-icons">add_circle</i>
      {{ article.createdAt }}
      <i class="material-icons">edit</i>
      {{ article.updatedAt }}
    </div>
    <div class="articleTags">
      <div
        class="button-article-tags"
        role="button"
        v-for="(tag, index) in article.tags"
        :key="index"
        @click="link(tag.name)"
      >
        {{ tag.name }}
      </div>
    </div>
  </div>
  <div class="row content">
    <div class="markdown-preview col" v-html="renderedMarkdown"></div>
  </div>
</template>

<style lang="scss" scoped>
.row {
  padding-right: 50px;
  padding-left: 50px;
}
.col {
  max-width: 100%;
}
.banner {
  min-height: 300px;
  > div {
    padding-bottom: 10px;
  }
  > .articleTitle {
    word-wrap: break-word;
    color: rebeccapurple;
  }
}
.content {
  min-height: 500px;
  font-family: "jf-openhuninn-2.1";
  > .col {
    min-width: 100%;
    min-height: 500px;
    border: 2px solid transparent;
    box-shadow: inset 0 0 10px 1px rgb(var(--v-theme-surface));
    border-radius: 20px;
  }
}
</style>

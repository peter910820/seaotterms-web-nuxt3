import { createError } from "h3";
import { useRuntimeConfig } from "nitropack/runtime/internal/config";
import { $fetch } from "ofetch";

const getUpstreamAuth = () => {
  const config = useRuntimeConfig();
  const baseURL = String(config.kurohelperApiUrl || "").replace(/\/+$/, "");
  const token = String(config.kurohelperApiToken || "").trim();

  if (!baseURL || !token) {
    throw createError({ statusCode: 500, statusMessage: "Missing kurohelper API configuration" });
  }

  return { baseURL, token };
};

export const fetchKurohelperApi = <T>(path: string): Promise<T> => {
  const { baseURL, token } = getUpstreamAuth();

  return $fetch<T>(path, {
    baseURL,
    headers: { Authorization: `Bearer ${token}` },
    retry: 0,
  });
};

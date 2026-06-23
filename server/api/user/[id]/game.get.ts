import { getRouterParam } from "h3";

import type { KuroHelperAPIOK, GetUserGameResponse } from "@/types/response";
import { fetchKurohelperApi } from "../../../utils/upstreamApi";

export default defineEventHandler((event) => {
  const id = String(getRouterParam(event, "id") ?? "").trim();
  return fetchKurohelperApi<KuroHelperAPIOK<GetUserGameResponse>>(`/api/user/${encodeURIComponent(id)}/game`);
});

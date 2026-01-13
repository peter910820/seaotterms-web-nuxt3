import type { UserGameErogs } from "@/types/response";
import type { UserGameErogsFlat } from "@/types/common";

export const flattenUserGameErogs = (data: UserGameErogs): UserGameErogsFlat => {
  return {
    userId: data.userId,
    gameErogsId: data.gameErogsId,
    completedAt: data.completedAt,
    createdAt: data.createdAt,
    gameName: data.gameErogs.name,
    brandId: data.gameErogs.brandErogs.id,
    brandName: data.gameErogs.brandErogs.name,
  };
};

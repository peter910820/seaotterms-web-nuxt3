export interface MessageData {
  statusCode: number;
  content: string;
  errCode: string;
}

export interface UserGameErogsFlat {
  userId: string;
  gameErogsId: number;
  completedAt: string | null;
  createdAt: string;
  gameName: string;
  brandId: number;
  brandName: string;
}

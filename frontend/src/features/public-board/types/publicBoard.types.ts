export interface PublicBoardPost {
  id: string;
  groupId: string;
  authorId: string;
  description?: string;
  publicationStatus: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface PublicBoardPage {
  posts: PublicBoardPost[];
  total: number;
  page: number;
  limit: number;
}

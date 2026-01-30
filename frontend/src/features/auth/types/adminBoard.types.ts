export interface AdminBoardPost {
  id: string;
  groupId: string;
  authorId: string;
  description?: string;
  publicationStatus: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface AdminBoardPage {
  posts: AdminBoardPost[];
  total: number;
  page: number;
  limit: number;
}

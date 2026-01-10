export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PublicationStatus = "VISIBLE" | "HIDDEN";

export interface AdminBoardPost {
  id: string;
  groupId: string;
  authorId: string;
  description?: string;
  publicationStatus: PublicationStatus;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBoardPage {
  posts: AdminBoardPost[];
  total: number;
  page: number;
  limit: number;
}

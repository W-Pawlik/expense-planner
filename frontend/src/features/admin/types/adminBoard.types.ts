import type { VisibilityStatus } from "../../financial-groups/types/financialGroup.types";
import type { FinancialPosition } from "../../financial-groups/types/financialPosition.types";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PublicationStatus = "VISIBLE" | "HIDDEN";

export interface AdminBoardPost {
  groupName: string;
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

export interface AdminPendingPlanDetails {
  post: AdminBoardPost;
  group: {
    id: string;
    name: string;
    projectionYears: number;
    visibilityStatus: VisibilityStatus;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
    positions: FinancialPosition[];
  };
}

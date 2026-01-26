import type { VisibilityStatus } from "../../financial-groups/types/financialGroup.types";
import type { FinancialPosition } from "../../financial-groups/types/financialPosition.types";

export interface PublicBoardPost {
  groupName: string;
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

export interface PublicPlanDetails {
  publishedAt: string;
  group: {
    id: string;
    name: string;
    projectionYears: number;
    visibilityStatus: VisibilityStatus;
    description?: string;
    createdAt: string;
    updatedAt: string;
    positions: FinancialPosition[];
  };
}

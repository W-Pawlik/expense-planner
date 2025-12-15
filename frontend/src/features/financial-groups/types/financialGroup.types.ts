import type { FinancialPosition } from "./financialPosition.types";

export type VisibilityStatus = "PRIVATE" | "PUBLIC";

export interface FinancialGroupSummary {
  id: string;
  name: string;
  projectionYears: number;
  visibilityStatus: VisibilityStatus;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface UpdateFinancialGroupInput {
  name?: string;
  description?: string | null;
  projectionYears?: number;
  visibilityStatus?: VisibilityStatus;
}

export interface FinancialGroupDetails extends FinancialGroupSummary {
  positions: FinancialPosition[];
}

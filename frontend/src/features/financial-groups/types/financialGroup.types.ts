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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FinancialGroupDetails extends FinancialGroupSummary {}

export interface UpdateFinancialGroupInput {
  name?: string;
  description?: string | null;
  projectionYears?: number;
  visibilityStatus?: VisibilityStatus;
}

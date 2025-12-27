export type PositionType = "INCOME" | "EXPENSE";
export type FrequencyType = "RECURRING" | "ONE_TIME";

export interface FinancialPosition {
  id: string;
  groupId: string;
  name: string;
  amount: number;
  positionType: PositionType;
  frequencyType: FrequencyType;
  notes?: string | null;
  category?: string | null;
  interestRate?: number | null;
  createdAt: string;
  updatedAt: string;
}

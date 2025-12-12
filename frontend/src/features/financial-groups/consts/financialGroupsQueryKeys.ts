export const financialGroupsQueryKeys = {
  all: ["financial-groups"] as const,
  list: () => [...financialGroupsQueryKeys.all, "list"] as const,
  details: (groupId: string) =>
    [...financialGroupsQueryKeys.all, "details", groupId] as const,
} as const;

export const financialGroupsUrls = {
  list: "/groups",
  create: "/groups",
  details: (groupId: string) => `/groups/${groupId}`,
} as const;

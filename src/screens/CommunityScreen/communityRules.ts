/** Display order of the community types. */
export const COMMUNITY_TYPES = [1, 2, 7, 3, 4, 5, 6];

/** InvitationRules.canBeInviteds: user type that can invite each type (0 = open registration). */
export const INVITED_BY: Record<number, number> = {
  1: 6,
  2: 6,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 0,
};

export const TYPE_COLOR: Record<number, string> = {
  1: "bg-green-primary",
  2: "bg-blue-primary",
  3: "bg-amber-400",
  4: "bg-purple-400",
  5: "bg-pink-400",
  6: "bg-orange-400",
  7: "bg-teal-300",
};

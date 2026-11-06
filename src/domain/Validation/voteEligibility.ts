export type ValidationTarget = "research" | "report" | "contribution" | "inspection" | "user";

export type VoteBlockReason =
  | "notVoterType"
  | "eraClosed"
  | "alreadyInvalidated"
  | "notInspected"
  | "supporter"
  | "regeneratorImmune"
  | "alreadyDenied"
  | "voterDenied"
  | "levelRequired"
  | "alreadyVoted"
  | "waitTimeBetweenVotes";

export const VOTER_USER_TYPES = [3, 4, 5];
export const REGENERATOR_VALIDATION_IMMUNITY = 6;
const INSPECTION_INSPECTED = 2;

/** State of the resource or user being voted on. */
export interface TargetState {
  target: ValidationTarget;
  /** Era stored in the resource (research/report/contribution era, inspection inspectedAtEra) or the user's contract era. */
  era: number;
  /** poolCurrentEra() of the contract that owns the resource. */
  currentEra: number;
  valid?: boolean;
  inspectionStatus?: number;
  targetUserType?: number;
  regeneratorInspections?: number;
  targetDenied?: boolean;
}

/** State of the connected voter. */
export interface VoterState {
  userType: number;
  denied: boolean;
  canVote: boolean;
  alreadyVoted: boolean;
  blocksToNextVote: number;
}

export interface VoteEligibility {
  /** The resource/user still accepts votes (independent of who is voting). */
  open: boolean;
  canVote: boolean;
  reason?: VoteBlockReason;
}

/** Target-side requirements of add<Research|Report|Contribution|Inspection>Validation and addUserValidation. */
function targetBlockReason(state: TargetState): VoteBlockReason | undefined {
  if (state.target === "user") {
    if (state.targetUserType === 7) return "supporter";
    if (state.targetDenied) return "alreadyDenied";
    if (state.targetUserType === 1 && (state.regeneratorInspections ?? 0) >= REGENERATOR_VALIDATION_IMMUNITY) return "regeneratorImmune";
    return undefined;
  }
  if (state.target === "inspection") {
    if (state.inspectionStatus !== INSPECTION_INSPECTED) return "notInspected";
  } else if (!state.valid) {
    return "alreadyInvalidated";
  }
  if (state.era !== state.currentEra) return "eraClosed";
  return undefined;
}

export function getVoteEligibility(state: TargetState, voter: VoterState): VoteEligibility {
  const targetReason = targetBlockReason(state);
  if (targetReason) return { open: false, canVote: false, reason: targetReason };

  if (!VOTER_USER_TYPES.includes(voter.userType)) return { open: true, canVote: false, reason: "notVoterType" };
  if (voter.denied) return { open: true, canVote: false, reason: "voterDenied" };
  if (!voter.canVote) return { open: true, canVote: false, reason: "levelRequired" };
  if (voter.alreadyVoted) return { open: true, canVote: false, reason: "alreadyVoted" };
  if (voter.blocksToNextVote > 0) return { open: true, canVote: false, reason: "waitTimeBetweenVotes" };

  return { open: true, canVote: true };
}

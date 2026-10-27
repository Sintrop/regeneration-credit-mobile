import { getVoteEligibility, TargetState, VoterState } from '../src/domain/Validation/voteEligibility';

const voter: VoterState = { userType: 3, denied: false, canVote: true, alreadyVoted: false, blocksToNextVote: 0 };
const research: TargetState = { target: 'research', era: 3, currentEra: 3, valid: true };

describe('getVoteEligibility: resources', () => {
  it('allows a voter on a valid resource of the current era', () => {
    expect(getVoteEligibility(research, voter)).toEqual({ open: true, canVote: true });
  });

  it('closes voting once the era of the resource has ended', () => {
    expect(getVoteEligibility({ ...research, era: 2 }, voter)).toEqual({ open: false, canVote: false, reason: 'eraClosed' });
  });

  it('closes voting on invalidated resources', () => {
    expect(getVoteEligibility({ ...research, valid: false }, voter).reason).toBe('alreadyInvalidated');
  });

  it('only accepts inspected inspections', () => {
    const inspection: TargetState = { target: 'inspection', era: 3, currentEra: 3, inspectionStatus: 1 };
    expect(getVoteEligibility(inspection, voter).reason).toBe('notInspected');
    expect(getVoteEligibility({ ...inspection, inspectionStatus: 2 }, voter).canVote).toBe(true);
  });
});

describe('getVoteEligibility: voter', () => {
  it('is only available to researchers, developers and contributors', () => {
    for (const userType of [1, 2, 6, 7]) {
      expect(getVoteEligibility(research, { ...voter, userType })).toEqual({ open: true, canVote: false, reason: 'notVoterType' });
    }
  });

  it('applies canVote, already voted, time between votes and denied', () => {
    expect(getVoteEligibility(research, { ...voter, canVote: false }).reason).toBe('levelRequired');
    expect(getVoteEligibility(research, { ...voter, alreadyVoted: true }).reason).toBe('alreadyVoted');
    expect(getVoteEligibility(research, { ...voter, blocksToNextVote: 100 }).reason).toBe('waitTimeBetweenVotes');
    expect(getVoteEligibility(research, { ...voter, denied: true }).reason).toBe('voterDenied');
  });
});

describe('getVoteEligibility: users', () => {
  const user: TargetState = { target: 'user', era: 3, currentEra: 3, targetUserType: 2 };

  it('allows voting on registered users', () => {
    expect(getVoteEligibility(user, voter).canVote).toBe(true);
  });

  it('protects supporters, denied users and regenerators with 6 inspections', () => {
    expect(getVoteEligibility({ ...user, targetUserType: 7 }, voter).reason).toBe('supporter');
    expect(getVoteEligibility({ ...user, targetDenied: true }, voter).reason).toBe('alreadyDenied');
    expect(getVoteEligibility({ ...user, targetUserType: 1, regeneratorInspections: 6 }, voter).reason).toBe('regeneratorImmune');
    expect(getVoteEligibility({ ...user, targetUserType: 1, regeneratorInspections: 5 }, voter).canVote).toBe(true);
  });
});

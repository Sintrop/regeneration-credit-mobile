jest.mock('@contracts', () => ({}));

import { excludeOffsetBurns } from '../src/domain/Feed/events/feedEventsService';
import { eventFeedId } from '../src/domain/Feed/events/fetchEvents';

describe('excludeOffsetBurns', () => {
  it('keeps only certifications without an offset in the same transaction', () => {
    const certified = [{ transactionHash: '0xa', amount: 1 }, { transactionHash: '0xb', amount: 2 }, { transactionHash: '0xc', amount: 3 }];
    const offsets = [{ transactionHash: '0xb' }];
    expect(excludeOffsetBurns(certified, offsets).map(item => item.amount)).toEqual([1, 3]);
  });

  it('returns everything when there are no offsets', () => {
    const certified = [{ transactionHash: '0xa' }];
    expect(excludeOffsetBurns(certified, [])).toHaveLength(1);
  });
});

describe('eventFeedId', () => {
  it('is unique for different feed types in the same block', () => {
    const ids = [1, 2, 3, 4].map(type => eventFeedId(3636764, type, 0));
    expect(new Set(ids).size).toBe(4);
  });

  it('is unique for different logs of the same type in the same block', () => {
    expect(eventFeedId(3636764, 1, 0)).not.toBe(eventFeedId(3636764, 1, 1));
  });

  it('stays a safe integer for current block heights', () => {
    expect(Number.isSafeInteger(eventFeedId(99999999, 4, 999))).toBe(true);
  });
});

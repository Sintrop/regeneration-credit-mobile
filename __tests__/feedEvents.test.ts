jest.mock('@contracts', () => ({}));
jest.mock('../src/contracts/registry', () => ({ CONTRACT_REGISTRY: [] }));

import { excludeOffsetBurns, peerToPeerTransfers } from '../src/domain/Feed/events/feedEventsService';
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

describe('peerToPeerTransfers', () => {
  const pool = '0xFC222077860d34dEfA62Dd8A848703025B7b75f7';
  const alice = '0x1111111111111111111111111111111111111111';
  const bob = '0x2222222222222222222222222222222222222222';
  const zero = '0x0000000000000000000000000000000000000000';

  it('keeps only person-to-person transfers', () => {
    const transfers = [
      { from: alice, to: bob, transactionHash: '0xa' },
      { from: pool, to: alice, transactionHash: '0xb' },
      { from: zero, to: pool, transactionHash: '0xc' },
      { from: alice, to: zero, transactionHash: '0xd' },
      { from: bob, to: alice, transactionHash: '0xe' },
    ];
    const result = peerToPeerTransfers(transfers, [pool.toLowerCase()], [{ transactionHash: '0xe' }]);
    expect(result.map(item => item.transactionHash)).toEqual(['0xa']);
  });
});

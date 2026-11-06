import { getPublishAvailability } from '../src/domain/Publishing/publishAvailability';

const base = { timeBetweenWorks: 192000, securityBlocksToValidation: 96000, nextEraIn: 1111880 };

describe('getPublishAvailability', () => {
  it('allows the first publication', () => {
    expect(getPublishAvailability({ ...base, currentBlock: 3640000, lastActionAt: 0 })).toEqual({ canPublish: true, blocksToWait: 0 });
  });

  it('blocks until timeBetweenWorks has passed (strictly greater, as in the contract)', () => {
    const last = 3500000;
    expect(getPublishAvailability({ ...base, currentBlock: last + 192000, lastActionAt: last })).toEqual({
      canPublish: false, reason: 'waitTime', blocksToWait: 1,
    });
    expect(getPublishAvailability({ ...base, currentBlock: last + 192001, lastActionAt: last }).canPublish).toBe(true);
  });

  it('blocks inside the end-of-era security window', () => {
    expect(getPublishAvailability({ ...base, nextEraIn: 96000, currentBlock: 3640000, lastActionAt: 0 })).toEqual({
      canPublish: false, reason: 'eraEnding', blocksToWait: 96000,
    });
  });

  it('ignores the security window for calculator items', () => {
    expect(getPublishAvailability({ ...base, nextEraIn: 10, currentBlock: 3640000, lastActionAt: 0, checkSecurityWindow: false }).canPublish).toBe(true);
  });
});

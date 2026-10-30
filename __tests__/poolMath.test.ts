import { epochForEra, eraPhase, percentage, tokensForEra, userEraTokens } from '../src/domain/Pools/poolMath';

describe('pool math', () => {
  it('groups 12 eras per epoch', () => {
    expect(epochForEra(1)).toBe(1);
    expect(epochForEra(12)).toBe(1);
    expect(epochForEra(13)).toBe(2);
  });

  it('matches tokensPerEra on-chain: 750M regenerators pool, era 1 = 31.25M', () => {
    expect(tokensForEra(750000000, 1)).toBe(31250000);
    expect(tokensForEra(750000000, 13)).toBe(15625000);
  });

  it('splits era tokens by levels like _calculateUserEraTokens', () => {
    // Regenerators era 1: 341 levels, 31.25M RC
    expect(userEraTokens(10, 341, 31250000)).toBeCloseTo(916422.29, 1);
    expect(userEraTokens(0, 341, 31250000)).toBe(0);
    expect(userEraTokens(5, 0, 31250000)).toBe(0);
  });

  it('opens an era for withdrawal only after it ends', () => {
    expect(eraPhase(3, 3)).toBe('current');
    expect(eraPhase(2, 3)).toBe('claimable');
  });

  it('clamps percentages', () => {
    expect(percentage(12738270, 750000000)).toBeCloseTo(1.698, 2);
    expect(percentage(5, 0)).toBe(0);
  });
});

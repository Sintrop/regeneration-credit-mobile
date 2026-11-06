import { blocksToDuration } from '../src/utils/blocksToDuration';

describe('blocksToDuration', () => {
  it('converts an era (1,152,000 blocks at 13 s) to about 173 days', () => {
    expect(blocksToDuration(1152000, 13)).toEqual({ value: 173, unit: 'days' });
  });

  it('defaults to the 13 s block time of go-sintrop', () => {
    expect(blocksToDuration(1112321)).toEqual({ value: 167, unit: 'days' });
  });

  it('switches to hours and minutes for short spans', () => {
    expect(blocksToDuration(6000, 13)).toEqual({ value: 22, unit: 'hours' });
    expect(blocksToDuration(100, 13)).toEqual({ value: 22, unit: 'minutes' });
  });

  it('never returns zero minutes or negative values', () => {
    expect(blocksToDuration(1, 13)).toEqual({ value: 1, unit: 'minutes' });
    expect(blocksToDuration(-50, 13)).toEqual({ value: 1, unit: 'minutes' });
  });
});

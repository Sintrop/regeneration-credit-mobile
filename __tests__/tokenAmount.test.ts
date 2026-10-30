import {
  amountToWei,
  applyPercentageDiscount,
  balanceToInput,
  requiredAmountToInput,
  normalizeAmountInput,
  parseAmountInput,
} from '../src/utils/tokenAmount';

describe('normalizeAmountInput', () => {
  it('accepts comma or dot as decimal separator', () => {
    expect(normalizeAmountInput('10,5')).toBe('10.5');
    expect(normalizeAmountInput(' 3.25 ')).toBe('3.25');
  });

  it('rejects anything that is not a plain decimal number', () => {
    for (const input of ['', ' ', '-1', '1e18', 'abc', '1.2.3', '1,2,3', '.5', '5.']) {
      expect(normalizeAmountInput(input)).toBeNull();
    }
  });
});

describe('parseAmountInput', () => {
  it('parses comma decimals instead of truncating them', () => {
    expect(parseAmountInput('10,5')).toBe(10.5);
  });

  it('returns NaN for invalid input', () => {
    expect(parseAmountInput('abc')).toBeNaN();
  });
});

describe('amountToWei', () => {
  it('converts whole and decimal amounts exactly', () => {
    expect(amountToWei('10')).toBe('10000000000000000000');
    expect(amountToWei('10,5')).toBe('10500000000000000000');
    expect(amountToWei('0.000000000000000001')).toBe('1');
  });

  it('keeps precision that floating point loses', () => {
    expect(amountToWei('123.456789')).toBe('123456789000000000000');
    expect(amountToWei('0.333333333333333333')).toBe('333333333333333333');
    expect(amountToWei('2549.87654321')).toBe('2549876543210000000000');
  });

  it('handles amounts far above Number.MAX_SAFE_INTEGER in wei', () => {
    expect(amountToWei('750000000')).toBe('750000000000000000000000000');
  });

  it('rejects more than 18 decimal places and invalid input', () => {
    expect(amountToWei('1.0000000000000000001')).toBeNull();
    expect(amountToWei('')).toBeNull();
    expect(amountToWei('1e3')).toBeNull();
  });
});

describe('applyPercentageDiscount', () => {
  it('computes the minimum amount to burn with integer math', () => {
    expect(applyPercentageDiscount('100000000000000000000', 5)).toBe('95000000000000000000');
    expect(applyPercentageDiscount('123456789000000000000', 5)).toBe('117283949550000000000');
  });

  it('rounds down', () => {
    expect(applyPercentageDiscount('1', 5)).toBe('0');
    expect(applyPercentageDiscount('19', 5)).toBe('18');
  });
});

describe('balanceToInput', () => {
  it('never rounds the balance up', () => {
    expect(balanceToInput(1.9999999)).toBe('1.999999');
    expect(balanceToInput(10)).toBe('10');
    expect(balanceToInput(0.5)).toBe('0.5');
  });

  it('avoids scientific notation for tiny balances', () => {
    expect(balanceToInput(0.0000012)).toBe('0.000001');
    expect(balanceToInput(1e-9)).toBe('');
  });

  it('returns an empty string for empty or invalid balances', () => {
    expect(balanceToInput(0)).toBe('');
    expect(balanceToInput(NaN)).toBe('');
  });

  it('produces input that amountToWei accepts', () => {
    expect(amountToWei(balanceToInput(1234.5678912345))).toBe('1234567891000000000000');
  });
});

describe('requiredAmountToInput', () => {
  it('rounds up so the amount covers what is required', () => {
    expect(requiredAmountToInput(1.0000001)).toBe('1.000001');
    expect(requiredAmountToInput(2.5)).toBe('2.5');
    expect(requiredAmountToInput(12)).toBe('12');
  });

  it('does not round up values that are exact up to float noise', () => {
    expect(requiredAmountToInput(0.1 + 0.2)).toBe('0.3');
  });

  it('returns an empty string for zero or invalid amounts', () => {
    expect(requiredAmountToInput(0)).toBe('');
    expect(requiredAmountToInput(NaN)).toBe('');
  });
});

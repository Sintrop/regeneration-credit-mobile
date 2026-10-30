import { classifyTransfer } from '../src/domain/Tx/classifyTransfer';

const me = '0xAbC0000000000000000000000000000000000001';
const other = '0x2220000000000000000000000000000000000002';
const pool = '0xFC222077860d34dEfA62Dd8A848703025B7b75f7';
const pools = { [pool.toLowerCase()]: 1 };

describe('classifyTransfer', () => {
  it('detects burns (offsets and tree funding)', () => {
    expect(classifyTransfer(me, '0x0000000000000000000000000000000000000000', me.toLowerCase(), pools)).toEqual({ kind: 'burn' });
  });
  it('detects pool withdrawals', () => {
    expect(classifyTransfer(pool, me, me, pools)).toEqual({ kind: 'poolWithdraw', poolType: 1 });
  });
  it('splits sent and received transfers, case-insensitively', () => {
    expect(classifyTransfer(me.toLowerCase(), other, me, pools).kind).toBe('send');
    expect(classifyTransfer(other, me.toUpperCase().replace('0X', '0x'), me, pools).kind).toBe('receive');
  });
});

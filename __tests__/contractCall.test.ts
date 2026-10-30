import { contractErrorMessage, formatCallResult, parseArgument } from '../src/utils/contractCall';

const p = (type: string, components?: any[]) => ({ name: 'x', type, components });

describe('parseArgument', () => {
  it('keeps large integers exact as decimal strings', () => {
    expect(parseArgument(p('uint256'), '123456789012345678901234567890')).toEqual({ ok: true, value: '123456789012345678901234567890' });
  });

  it('rejects non-integers and negative unsigned values', () => {
    expect(parseArgument(p('uint256'), '1.5')).toEqual({ ok: false, error: 'integer' });
    expect(parseArgument(p('uint64'), '-3')).toEqual({ ok: false, error: 'negative' });
    expect(parseArgument(p('int256'), '-3')).toEqual({ ok: true, value: '-3' });
  });

  it('converts RC amounts to wei when asked', () => {
    expect(parseArgument(p('uint256'), '1,5', true)).toEqual({ ok: true, value: '1500000000000000000' });
  });

  it('validates and checksums addresses', () => {
    expect(parseArgument(p('address'), '0x24fd0c0ea35f00625094795aa105fce15cb6f1ed')).toEqual({ ok: true, value: '0x24fD0C0eA35F00625094795aa105fcE15cb6f1Ed' });
    expect(parseArgument(p('address'), '0x123')).toEqual({ ok: false, error: 'address' });
  });

  it('reads booleans', () => {
    expect(parseArgument(p('bool'), 'true')).toEqual({ ok: true, value: true });
    expect(parseArgument(p('bool'), '0')).toEqual({ ok: true, value: false });
    expect(parseArgument(p('bool'), 'sim')).toEqual({ ok: false, error: 'bool' });
  });

  it('checks bytes length', () => {
    expect(parseArgument(p('bytes32'), '0x' + 'ab'.repeat(32))).toEqual({ ok: true, value: '0x' + 'ab'.repeat(32) });
    expect(parseArgument(p('bytes32'), '0xab')).toEqual({ ok: false, error: 'bytes32' });
  });

  it('parses arrays and validates each item', () => {
    expect(parseArgument(p('uint64[]'), '[1, 2]')).toEqual({ ok: true, value: ['1', '2'] });
    expect(parseArgument(p('uint64[]'), '[1, "x"]')).toEqual({ ok: false, error: 'integer' });
    expect(parseArgument(p('uint64[]'), '1,2')).toEqual({ ok: false, error: 'json' });
  });

  it('allows empty strings but requires other values', () => {
    expect(parseArgument(p('string'), '')).toEqual({ ok: true, value: '' });
    expect(parseArgument(p('uint8'), ' ')).toEqual({ ok: false, error: 'required' });
  });
});

describe('formatCallResult', () => {
  it('formats a single scalar output', () => {
    expect(formatCallResult([{ name: '', type: 'uint256' }], 42n)).toEqual([{ label: '', type: 'uint256', value: '42' }]);
  });

  it('formats several outputs by name', () => {
    const outputs = [{ name: 'a', type: 'bool' }, { name: 'b', type: 'address' }];
    expect(formatCallResult(outputs, { 0: true, 1: '0xabc', a: true, b: '0xabc', __length__: 2 })).toEqual([
      { label: 'a', type: 'bool', value: 'true' },
      { label: 'b', type: 'address', value: '0xabc' },
    ]);
  });

  it('formats tuples and arrays as nested nodes', () => {
    const outputs = [{ name: '', type: 'tuple', components: [{ name: 'id', type: 'uint64' }, { name: 'ids', type: 'uint256[]' }] }];
    expect(formatCallResult(outputs, { id: 7n, ids: [1n, 2n] })).toEqual([{
      label: '',
      type: 'tuple',
      children: [
        { label: 'id', type: 'uint64', value: '7' },
        { label: 'ids', type: 'uint256[]', value: undefined, children: [
          { label: '[0]', type: 'uint256', value: '1' },
          { label: '[1]', type: 'uint256', value: '2' },
        ] },
      ],
    }]);
  });
});

describe('contractErrorMessage', () => {
  it('keeps only the revert reason', () => {
    expect(contractErrorMessage({ message: 'Returned error: execution reverted: Only supporters' })).toBe('Only supporters');
  });
});

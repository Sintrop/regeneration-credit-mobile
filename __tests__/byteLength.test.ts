import { fitsBytes, utf8ByteLength } from '../src/utils/byteLength';

describe('utf8ByteLength', () => {
  it('counts ASCII as one byte per character', () => {
    expect(utf8ByteLength('Regeneration')).toBe(12);
  });

  it('counts accented letters as two bytes, like Solidity bytes(text).length', () => {
    expect(utf8ByteLength('ç')).toBe(2);
    expect(utf8ByteLength('Regeneração')).toBe(13);
  });

  it('counts emoji as four bytes', () => {
    expect(utf8ByteLength('🌳')).toBe(4);
  });
});

describe('fitsBytes', () => {
  it('rejects text over the limit even when the character count fits', () => {
    const text = 'ã'.repeat(30);
    expect(text.length).toBe(30);
    expect(fitsBytes(text, 50)).toBe(false);
  });
});

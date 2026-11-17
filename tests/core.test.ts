import { describe, expect, it } from 'vitest';
import { calculateCapacity, decodeLSB, encodeLSB } from '../src/services/steganographyService';
import { buildPacket, parsePacket } from '../src/services/cryptoService';

describe('steganography primitives', () => {
  it('calculates non-negative capacity with packet overhead', () => {
    expect(calculateCapacity(50, 50)).toBe(901);
    expect(calculateCapacity(1, 1)).toBe(0);
  });

  it('round trips packet bits without changing alpha', () => {
    const source = new ImageData(20, 20);
    source.data.fill(128);
    source.data.forEach((_, i) => { if (i % 4 === 3) source.data[i] = 77; });
    const packet = buildPacket(new Uint8Array(16).fill(3));
    const encoded = encodeLSB(source, packet);
    expect(Array.from(encoded.data).filter((_, i) => i % 4 === 3)).toEqual(Array(400).fill(77));
    expect(Array.from(decodeLSB(encoded))).toEqual(Array.from(packet));
  });

  it('rejects malformed packet lengths', () => {
    expect(() => parsePacket(new Uint8Array([71, 72, 83, 84]))).toThrow();
  });
});

import { describe, expect, it } from 'vitest';
import { decryptPayload, encryptPayload, parsePacket } from '../src/services/cryptoService';
import { buildPacket } from '../src/services/cryptoService';

describe('crypto integration', () => {
  it('round trips unicode plaintext through AES-GCM and GHST', async () => {
    const plaintext = 'GhostPixel 🔐 — privacy test';
    const packet = await encryptPayload(plaintext, 'correct horse battery staple');
    expect(parsePacket(packet).salt).toHaveLength(16);
    expect(parsePacket(packet).iv).toHaveLength(12);
    await expect(decryptPayload(packet, 'correct horse battery staple')).resolves.toBe(plaintext);
  });
  it('rejects wrong passphrase and tampered ciphertext', async () => {
    const packet = await encryptPayload('secret', 'passphrase');
    await expect(decryptPayload(packet, 'wrong')).rejects.toThrow('Decryption failed');
    const tampered = packet.slice(); tampered[tampered.length - 1] ^= 1;
    await expect(decryptPayload(tampered, 'passphrase')).rejects.toThrow('Decryption failed');
  });
  it('rejects inconsistent packet length before decrypting', () => {
    const packet = buildPacket(new Uint8Array(16));
    packet[35] = 15;
    expect(() => parsePacket(packet)).toThrow('payload length');
  });
});

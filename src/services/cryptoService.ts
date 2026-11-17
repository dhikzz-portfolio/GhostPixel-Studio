import { PACKET_HEADER_SIZE, PBKDF2_ITERATIONS } from '../types/crypto';

const MAGIC = new Uint8Array([0x47, 0x48, 0x53, 0x54]);
const ensureCrypto = () => { if (!globalThis.crypto?.subtle) throw new Error('Web Crypto API is unavailable'); return globalThis.crypto; };
const asBufferSource = (value: Uint8Array): ArrayBuffer => value.slice().buffer;

export function buildPacket(ciphertext: Uint8Array, salt = new Uint8Array(16), iv = new Uint8Array(12)): Uint8Array {
  if (salt.length !== 16 || iv.length !== 12) throw new Error('Invalid salt or IV length');
  if (ciphertext.length > 0xffffffff - PACKET_HEADER_SIZE) throw new Error('Payload is too large');
  const packet = new Uint8Array(PACKET_HEADER_SIZE + ciphertext.length); packet.set(MAGIC); packet.set(salt, 4); packet.set(iv, 20); new DataView(packet.buffer).setUint32(32, ciphertext.length, false); packet.set(ciphertext, PACKET_HEADER_SIZE); return packet;
}

export function parsePacket(packet: Uint8Array): { salt: Uint8Array; iv: Uint8Array; ciphertext: Uint8Array } {
  if (packet.length < PACKET_HEADER_SIZE || !MAGIC.every((v, i) => packet[i] === v)) throw new Error('Invalid GHST packet');
  const length = new DataView(packet.buffer, packet.byteOffset, packet.byteLength).getUint32(32, false);
  if (length < 16 || length !== packet.length - PACKET_HEADER_SIZE) throw new Error('Invalid packet payload length');
  return { salt: packet.slice(4, 20), iv: packet.slice(20, 32), ciphertext: packet.slice(36) };
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  if (!passphrase) throw new Error('Passphrase is required');
  const c = ensureCrypto(); const material = await c.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return c.subtle.deriveKey({ name: 'PBKDF2', salt: asBufferSource(salt), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

export async function encryptPayload(text: string, passphrase: string): Promise<Uint8Array> {
  const c = ensureCrypto(); const salt = c.getRandomValues(new Uint8Array(16)); const iv = c.getRandomValues(new Uint8Array(12)); const key = await deriveKey(passphrase, salt);
  const ciphertext = new Uint8Array(await c.subtle.encrypt({ name: 'AES-GCM', iv: asBufferSource(iv) }, key, asBufferSource(new TextEncoder().encode(text))));
  return buildPacket(ciphertext, salt, iv);
}

export async function decryptPayload(packet: Uint8Array, passphrase: string): Promise<string> {
  const c = ensureCrypto(); const { salt, iv, ciphertext } = parsePacket(packet); const key = await deriveKey(passphrase, salt);
  try { return new TextDecoder().decode(await c.subtle.decrypt({ name: 'AES-GCM', iv: asBufferSource(iv) }, key, asBufferSource(ciphertext))); } catch { throw new Error('Decryption failed: wrong passphrase or corrupted payload'); }
}

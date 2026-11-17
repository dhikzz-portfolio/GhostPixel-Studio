import { PACKET_HEADER_SIZE } from '../types/crypto';
import type { DiffMetrics } from '../types/steganography';

export const calculateCapacity = (width: number, height: number) => Math.max(0, Math.floor((width * height * 3) / 8) - PACKET_HEADER_SIZE);
const bitAt = (payload: Uint8Array, bit: number) => (payload[Math.floor(bit / 8)] >> (7 - (bit % 8))) & 1;
export function encodeLSB(imageData: ImageData, payload: Uint8Array): ImageData {
  const out = new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height); const capacityBits = imageData.width * imageData.height * 3;
  if (payload.length * 8 > capacityBits) throw new Error(`Payload exceeds image capacity by ${payload.length * 8 - capacityBits} bits`);
  let bit = 0; for (let i = 0; i < out.data.length && bit < payload.length * 8; i += 4) for (let c = 0; c < 3 && bit < payload.length * 8; c++) out.data[i + c] = (out.data[i + c] & 0xfe) | bitAt(payload, bit++);
  return out;
}
export function decodeLSB(imageData: ImageData): Uint8Array {
  const available = imageData.width * imageData.height * 3; if (available < PACKET_HEADER_SIZE * 8) throw new Error('Image is too small for a GhostPixel packet');
  const read = (count: number) => { const out = new Uint8Array(count); let bit = 0; for (let i = 0; i < imageData.data.length && bit < count * 8; i += 4) { for (let c = 0; c < 3 && bit < count * 8; c++) { const byteIndex = Math.floor(bit / 8); out[byteIndex] = (out[byteIndex] << 1) | (imageData.data[i + c] & 1); bit++; } } return out; };
  const header = read(PACKET_HEADER_SIZE); if (header[0] !== 0x47 || header[1] !== 0x48 || header[2] !== 0x53 || header[3] !== 0x54) throw new Error('No valid GHST header found');
  const length = new DataView(header.buffer).getUint32(32, false); if (length < 16 || length > Math.floor(available / 8) - PACKET_HEADER_SIZE) throw new Error('Invalid embedded payload length');
  const all = read(PACKET_HEADER_SIZE + length); return all;
}
export function calculateDiff(a: ImageData, b: ImageData): DiffMetrics { if (a.data.length !== b.data.length) throw new Error('Images must have equal dimensions'); let sum = 0, changedPixels = 0, changedChannels = 0; for (let i = 0; i < a.data.length; i++) { if (i % 4 !== 3) { const d = a.data[i] - b.data[i]; sum += d * d; if (d) changedChannels++; if (d && i % 4 === 0) changedPixels++; } } const count = (a.width * a.height * 3); const mse = sum / count; return { changedPixels, changedChannels, mse, psnr: mse === 0 ? Infinity : 10 * Math.log10((255 * 255) / mse) }; }

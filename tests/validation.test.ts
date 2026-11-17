import { describe, expect, it } from 'vitest';
import { formatFromName, validateImageFile } from '../src/services/fileValidationService';
import { calculateHistogram, compareImageData } from '../src/services/visualAnalysisService';

describe('image signature validation', () => {
  it('recognizes supported extensions', () => { expect(formatFromName('photo.JPG')).toBe('jpeg'); expect(formatFromName('image.png')).toBe('png'); expect(formatFromName('image.webp')).toBe('webp'); });
  it('rejects a mismatched signature', async () => { const file = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], 'fake.jpg', { type: 'image/jpeg' }); await expect(validateImageFile(file)).rejects.toThrow('signature'); });
  it('accepts a valid PNG signature', async () => { const file = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], 'image.png', { type: 'image/png' }); await expect(validateImageFile(file)).resolves.toBe('png'); });
  it('rejects a MIME type that disagrees with the extension', async () => { const file = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], 'image.png', { type: 'image/jpeg' }); await expect(validateImageFile(file)).rejects.toThrow('MIME type'); });
});

describe('visual analysis', () => {
  it('returns zero MSE and infinite PSNR for identical RGB pixels', () => { const a = new ImageData(2, 1); a.data.set([10, 20, 30, 255, 40, 50, 60, 255]); expect(compareImageData(a, new ImageData(new Uint8ClampedArray(a.data), 2, 1))).toMatchObject({ mse: 0, psnr: Infinity, changedPixels: 0 }); });
  it('calculates RGB histogram bins and ignores alpha', () => { const a = new ImageData(1, 1); a.data.set([10, 20, 30, 99]); const h = calculateHistogram(a); expect(h.red[10]).toBe(1); expect(h.green[20]).toBe(1); expect(h.blue[30]).toBe(1); });
  it('rejects incompatible dimensions', () => { expect(() => compareImageData(new ImageData(1, 1), new ImageData(2, 1))).toThrow('equal dimensions'); });
});

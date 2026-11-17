import type { DiffMetrics } from '../types/steganography';

export interface Histogram { red: number[]; green: number[]; blue: number[]; }

export function calculateHistogram(image: ImageData): Histogram {
  const red = Array(256).fill(0) as number[];
  const green = Array(256).fill(0) as number[];
  const blue = Array(256).fill(0) as number[];
  for (let i = 0; i < image.data.length; i += 4) { red[image.data[i]]++; green[image.data[i + 1]]++; blue[image.data[i + 2]]++; }
  return { red, green, blue };
}

export function compareImageData(original: ImageData, processed: ImageData): DiffMetrics {
  if (original.width !== processed.width || original.height !== processed.height) throw new Error('Images must have equal dimensions for comparison.');
  let sum = 0; let changedPixels = 0; let changedChannels = 0;
  for (let i = 0; i < original.data.length; i += 4) {
    let pixelChanged = false;
    for (let c = 0; c < 3; c++) { const delta = original.data[i + c] - processed.data[i + c]; sum += delta * delta; if (delta !== 0) { changedChannels++; pixelChanged = true; } }
    if (pixelChanged) changedPixels++;
  }
  const sampleCount = original.width * original.height * 3;
  const mse = sum / sampleCount;
  return { changedPixels, changedChannels, mse, psnr: mse === 0 ? Infinity : 10 * Math.log10((255 * 255) / mse) };
}

export async function imageDataFromBlob(blob: Blob): Promise<ImageData> {
  const url = URL.createObjectURL(blob);
  try { const image = await new Promise<HTMLImageElement>((resolve, reject) => { const element = new Image(); element.onload = () => resolve(element); element.onerror = () => reject(new Error('Unable to decode image for comparison.')); element.src = url; }); const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight; const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas is unavailable.'); return context.getImageData(0, 0, canvas.width, canvas.height); }
  finally { URL.revokeObjectURL(url); }
}

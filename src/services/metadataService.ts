import exifr from 'exifr';
import type { MetadataResult, MetadataTag, RiskLevel } from '../types/metadata';

const classify = (raw: Record<string, unknown>, hasGps: boolean): [RiskLevel, string] => {
  if (hasGps) return ['CRITICAL', 'GPS coordinates detected.'];
  if (raw.Make || raw.Model || raw.SerialNumber || raw.DateTimeOriginal) return ['WARNING', 'Device identity or capture timestamp detected.'];
  return ['SAFE', 'No relevant sensitive metadata detected.'];
};
export async function parseImageMetadata(file: File): Promise<MetadataResult> {
  try {
    const raw = await exifr.parse(file, { tiff: true, xmp: true, iptc: true, gps: true, reviveValues: true }) as Record<string, unknown> | undefined;
    if (!raw || Object.keys(raw).length === 0) return { tags: [], riskLevel: 'SAFE', riskReason: 'No metadata found.', hasGps: false, metadataFound: false, parseStatus: 'EMPTY' };
    const latitude = typeof raw.latitude === 'number' ? raw.latitude : undefined;
    const longitude = typeof raw.longitude === 'number' ? raw.longitude : undefined;
    const hasGps = latitude !== undefined && longitude !== undefined && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
    const [riskLevel, riskReason] = classify(raw, hasGps);
    const tags: MetadataTag[] = Object.entries(raw).map(([property, value]) => ({ property, value: formatValue(value), category: categoryOf(property) }));
    return { tags, riskLevel, riskReason, hasGps, latitude, longitude, metadataFound: true, parseStatus: 'SUCCESS' };
  } catch { return { tags: [], riskLevel: 'SAFE', riskReason: 'Metadata parsing failed; file was not classified as clean.', hasGps: false, metadataFound: false, parseStatus: 'ERROR' }; }
}
const formatValue = (value: unknown) => value instanceof Uint8Array ? `[binary ${value.byteLength} bytes]` : typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
const categoryOf = (key: string) => key.toLowerCase().includes('gps') || ['latitude', 'longitude'].some(v => key.toLowerCase().includes(v)) ? 'GPS' : key.toLowerCase().includes('date') ? 'Capture' : ['make', 'model', 'serial', 'software'].some(v => key.toLowerCase().includes(v)) ? 'Device' : 'Other';
export async function sanitizeImage(file: File, format: 'image/png' | 'image/webp' = 'image/png'): Promise<Blob> {
  const url = URL.createObjectURL(file); try { const image = await new Promise<HTMLImageElement>((resolve, reject) => { const el = new Image(); el.onload = () => resolve(el); el.onerror = () => reject(new Error('Image decode failed')); el.src = url; }); const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight; const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas unavailable'); ctx.drawImage(image, 0, 0); const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('Image export failed')), format)); return blob; } finally { URL.revokeObjectURL(url); }
}

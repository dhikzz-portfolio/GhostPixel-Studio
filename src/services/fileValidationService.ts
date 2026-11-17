export type SupportedImageFormat = 'jpeg' | 'png' | 'webp';

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileValidationError';
  }
}

const signatures: Record<SupportedImageFormat, (bytes: Uint8Array) => boolean> = {
  jpeg: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  png: (b) => b.length >= 8 && b.slice(0, 8).every((v, i) => v === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][i]),
  webp: (b) => b.length >= 12 && ascii(b.slice(0, 4)) === 'RIFF' && ascii(b.slice(8, 12)) === 'WEBP',
};

function ascii(bytes: Uint8Array): string {
  return String.fromCharCode(...bytes);
}

export function formatFromName(name: string): SupportedImageFormat | undefined {
  const ext = name.toLowerCase().split('.').pop();
  return ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : ext === 'png' ? 'png' : ext === 'webp' ? 'webp' : undefined;
}

export async function validateImageFile(file: File, maxBytes = 50 * 1024 * 1024): Promise<SupportedImageFormat> {
  if (!file || file.size === 0) throw new FileValidationError('Empty image file.');
  if (file.size > maxBytes) throw new FileValidationError('Image exceeds the 50 MB browser safety limit.');
  const format = formatFromName(file.name);
  if (!format) throw new FileValidationError('Unsupported image format. Use JPEG, PNG, or WebP.');
  const declared = file.type.toLowerCase();
  const expectedMime = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
  if (declared && declared !== expectedMime) throw new FileValidationError('MIME type does not match the file extension.');
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (!signatures[format](bytes)) throw new FileValidationError('File signature does not match its extension.');
  return format;
}

class TestImageData {
  readonly data: Uint8ClampedArray;
  readonly width: number;
  readonly height: number;
  constructor(widthOrData: number | Uint8ClampedArray, heightOrWidth: number, height?: number) {
    if (typeof widthOrData === 'number') { this.width = widthOrData; this.height = heightOrWidth; this.data = new Uint8ClampedArray(this.width * this.height * 4); }
    else { this.data = new Uint8ClampedArray(widthOrData); this.width = heightOrWidth; this.height = height ?? 0; }
  }
}
(globalThis as unknown as { ImageData: typeof TestImageData }).ImageData = TestImageData;

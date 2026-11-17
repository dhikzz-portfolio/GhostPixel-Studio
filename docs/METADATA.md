# Metadata Inspector

## Supported formats

- JPEG/JPG
- PNG
- WebP

Input validation checks:

1. File is non-empty.
2. File is below the 50 MB browser safety limit.
3. Extension is supported.
4. MIME type agrees with the extension when a MIME type is declared.
5. Binary signature agrees with the detected format.
6. Browser image decoding succeeds before image operations.

## Parser

Metadata extraction uses `exifr` in `src/services/metadataService.ts` and can expose EXIF, TIFF, IPTC, XMP, and GPS fields returned by the parser.

Tags are normalized into:

```ts
interface MetadataTag {
  property: string;
  value: string;
  category?: string;
}
```

## Risk classification

- `CRITICAL`: valid latitude and longitude are present.
- `WARNING`: no valid GPS, but camera identity, serial information, or capture date is present.
- `SAFE`: no relevant sensitive metadata is detected.
- Parse errors are represented as `parseStatus: ERROR` and must not be interpreted as proof that the file is clean.

Coordinates are validated against:

- Latitude: -90 through 90.
- Longitude: -180 through 180.

Zero is valid and is not treated as missing.

## GPS map

When valid coordinates exist, the Metadata Scrubber renders a Leaflet map with:

- Marker.
- Popup containing formatted coordinates.
- Zoom and pan.
- External OpenStreetMap tile layer.

No reverse geocoding is performed. Tile requests may reveal the displayed location to the tile provider.

## Search and display

The UI provides case-insensitive search over property names and values. Values are rendered as text, not executable HTML.

## Limitations

Parser output depends on the metadata supported by the browser-side `exifr` version and the source format. Absence of reported metadata is not proof that no hidden or unsupported metadata exists. Use ExifTool for independent QA verification.

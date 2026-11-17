# Metadata Sanitization

## Pipeline

1. Validate the input file.
2. Decode the image in the browser.
3. Create a canvas with the decoded image dimensions.
4. Draw the image onto the canvas.
5. Export a new Blob, PNG by default.
6. Reinspect the output with the browser metadata parser.
7. Revoke temporary object URLs.
8. Offer download only after the operation completes.

## Output formats

- PNG is the default lossless raster output.
- WebP can be requested when supported by the browser and export path.

## What rasterization does

Canvas export creates a new raster image and does not intentionally copy application-visible EXIF/TIFF/IPTC/XMP structures. It may nevertheless change or omit:

- ICC/color profiles.
- Orientation representation.
- Original compression characteristics.
- Non-pixel format information.
- Image thumbnails.

The output is not claimed to be binary-identical to the original.

## Verification

Application-level verification reparses the output. Independent verification should use ExifTool:

```bash
exiftool -a -u -g1 -j original.jpg > original.json
exiftool -a -u -g1 -j sanitized.png > sanitized.json
```

Compare EXIF, TIFF, GPS, XMP, IPTC, camera, date/time, software, thumbnail, and other fields.

ExifTool is not a runtime browser dependency and was not available in the current validation environment. See `EXIFTOOL_VERIFICATION_REPORT.md`.

## Failure handling

Decode errors, unavailable canvas contexts, and Blob export failures are surfaced as errors. A successful `toBlob()` call alone is not treated as proof that all metadata was removed.

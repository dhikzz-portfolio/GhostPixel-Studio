# ExifTool Verification Report

Status: NOT RUN / BLOCKED

Reason: ExifTool is not installed or available on PATH in the validation environment.

Required commands when available:

```bash
exiftool -a -u -g1 -j original-image.jpg > original.exiftool.json
exiftool -a -u -g1 -j sanitized-image.png > sanitized.exiftool.json
```

Compare EXIF, TIFF, GPS, XMP, IPTC, camera, timestamp, software, and thumbnail fields. Do not treat exifr-only inspection as independent verification.

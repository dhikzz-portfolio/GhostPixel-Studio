# Testing Guide

## Automated checks

Run from the project root:

```bash
npm test
npm run lint
npm run build
```

Current verified local result:

- 3 Vitest files.
- 13 tests passed.
- ESLint passed.
- TypeScript and Vite production build passed.

## Test coverage areas

### Core steganography

- Capacity calculation.
- RGB LSB round trip.
- Alpha preservation.
- Malformed GHST packet rejection.

### File and visual validation

- Supported extension detection.
- Invalid signature rejection.
- Valid PNG signature acceptance.
- MIME/extension mismatch rejection.
- Identical-image MSE/PSNR.
- RGB histogram bins.
- Dimension mismatch rejection.

### Crypto integration

- Unicode plaintext round trip.
- Salt and IV sizing.
- Wrong passphrase rejection.
- Tamper rejection.
- Packet-length rejection.

## Browser tests

The Playwright configuration defines Chromium, Firefox, and WebKit projects:

```bash
npm run test:e2e:install
npm run test:e2e
```

Test discovery can be checked without browsers:

```bash
npm run test:e2e -- --list
```

Actual browser execution must be reported as NOT RUN if the browser binaries are unavailable.

## Independent metadata verification

ExifTool is a QA tool, not a browser runtime dependency. When installed, compare original and sanitized files using JSON output:

```bash
exiftool -a -u -g1 -j original.jpg > original.exiftool.json
exiftool -a -u -g1 -j sanitized.png > sanitized.exiftool.json
```

## Test limitations

The current repository does not yet contain a complete public/synthetic fixture matrix for all EXIF, XMP, IPTC, GPS, corrupted, truncated, and large-image cases. Those cases should be added before declaring full blueprint acceptance.

# GhostPixel Studio

Client-side privacy forensics and crypto-steganography workbench built with React, TypeScript, Vite, exifr, Canvas, and Web Crypto.

## Run

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm test
npm run build
```

## Implemented

- EXIF/TIFF/XMP/IPTC/GPS inspection with SAFE/WARNING/CRITICAL risk classification.
- Canvas rasterization to clean PNG/WebP output with object URL cleanup.
- PBKDF2-SHA256 (100,000 iterations) and AES-256-GCM.
- GHST packet format: 4-byte magic, 16-byte salt, 12-byte IV, 4-byte big-endian ciphertext length, ciphertext plus GCM tag.
- RGB-only 1-bit LSB encoding/decoding with alpha preservation and capacity checks.
- JPEG/PNG/WebP extension, MIME, and binary signature validation.
- Leaflet GPS marker with explicit external tile privacy notice.
- VisualDiff side-by-side previews, RGB histogram, MSE, PSNR, and dimension validation.
- Unit/integration tests, Playwright smoke configuration for Chromium/Firefox/WebKit, and ESLint configuration.

## Privacy and limitations

File bytes, image pixels, metadata, payloads, and passphrases are processed in browser memory and are not uploaded by the application. Leaflet uses OpenStreetMap tile requests when a valid GPS point is shown; those tile requests may reveal the displayed location to the tile provider, but no image or metadata upload/geocoding request is made. Canvas sanitization creates a new rasterized file and may change color profiles, orientation representation, or other non-pixel characteristics. LSB steganography is not undetectable or a substitute for secure operational practices.

## Packet capacity

`floor(width * height * 3 / 8) - 36` bytes is the maximum ciphertext capacity after the fixed packet header. AES-GCM adds a 16-byte authentication tag to the encrypted payload.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Metadata Inspector](docs/METADATA.md)
- [Sanitization](docs/SANITIZATION.md)
- [Cryptography and GHST packet](docs/CRYPTOGRAPHY.md)
- [LSB steganography](docs/STEGANOGRAPHY.md)
- [Testing guide](docs/TESTING.md)
- [Browser compatibility](docs/BROWSER_COMPATIBILITY.md)
- [Privacy and security](docs/PRIVACY_SECURITY.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Completion report](docs/IMPLEMENTATION_COMPLETION_REPORT.md)

## Testing and verification

```bash
npm test
npm run lint
npm run build
npm run test:e2e:install   # one-time browser download
npm run test:e2e
npm audit
```

The documentation distinguishes verified, not-run, and blocked checks; no browser or ExifTool result is marked PASS without actual execution.


The repository currently includes browser smoke tests for Chromium, Firefox, and WebKit. Full browser execution requires the corresponding Playwright browser binaries. ExifTool verification is a development/QA step and is not a runtime dependency; run it against original and sanitized files when ExifTool is installed.

## Status

PARTIALLY COMPLETE: the application features and automated unit/integration checks are implemented. Browser test definitions are present but require browser binaries to execute. Independent ExifTool verification is not run in environments where ExifTool is unavailable. `npm audit` currently reports six vulnerabilities in development tooling (Vite/Vitest dependency chains); they are documented as residual risk because available fixes require major-version upgrades outside the pinned React 18/Vite 5 compatibility target.

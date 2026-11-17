# Architecture

## Overview

GhostPixel Studio adalah aplikasi frontend-only berbasis React 18, TypeScript, dan Vite. File gambar, metadata, payload, passphrase, dan kunci kriptografi diproses di memori browser.

Tidak ada backend pemrosesan file.

## Layers

```text
React UI
  ├── Metadata Scrubber
  ├── Stego Encoder
  └── Stego Decoder
        │
        ├── fileValidationService
        ├── metadataService
        ├── visualAnalysisService
        ├── cryptoService
        └── steganographyService
                │
                ├── File / Blob API
                ├── Canvas 2D API
                └── Web Crypto API
```

## Main data flows

### Metadata inspection

```text
File picker/drop
  → extension, MIME, and signature validation
  → exifr parsing
  → GPS validation
  → privacy risk classification
  → metadata table and optional Leaflet map
```

### Sanitization

```text
Original File
  → browser image decode
  → Canvas rasterization
  → PNG/WebP Blob
  → metadata reinspection by application parser
  → download URL
```

### Steganography

```text
Plaintext + passphrase
  → PBKDF2-SHA256
  → AES-256-GCM
  → GHST packet
  → RGB LSB encoding
  → PNG Blob
```

Reverse decoding validates the packet and authenticates AES-GCM before displaying plaintext.

## Resource lifecycle

- Object URLs are revoked after use.
- Canvas data is kept only for the active operation.
- Passphrases are held in React state only while entered by the user.
- No localStorage/sessionStorage persistence is used for secrets.
- Leaflet is isolated in `src/components/metadata/LeafletMap.tsx`.

## Important limitation

Leaflet tile loading is external network activity. It may expose the displayed GPS coordinates to the tile provider. Image bytes and metadata are not uploaded by the application.

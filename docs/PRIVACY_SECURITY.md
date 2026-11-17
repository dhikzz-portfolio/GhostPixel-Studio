# Privacy and Security

## Data flow guarantee

The application has no backend processing endpoint. Core operations occur in browser memory:

- File validation.
- Metadata parsing.
- GPS extraction.
- Canvas rasterization.
- PBKDF2 derivation.
- AES-GCM encryption/decryption.
- LSB encoding/decoding.
- PNG export.

## Network behavior

The Leaflet map loads external OpenStreetMap tiles when a valid GPS coordinate is displayed. This can reveal the map viewport/location to the tile provider.

The application does not perform:

- Image uploads.
- Metadata uploads.
- Reverse geocoding.
- Payload uploads.
- Passphrase transmission.
- Analytics containing image or metadata data.

## Secret handling

Passphrases are not persisted in localStorage or sent to a server. Derived Web Crypto keys are non-extractable and are not exported.

Decrypted output is rendered as text. It is not evaluated as JavaScript or HTML.

## Sanitization limitations

Canvas produces a new raster image but cannot guarantee preservation of all original color profiles, orientation metadata, compression behavior, or format-specific information. Output must be independently inspected for high-assurance workflows.

## Development dependency audit

`npm audit --omit=dev` reported no production vulnerabilities in the last recorded validation. Full audit reported six development-tooling findings in Vite/Vitest dependency chains. See `IMPLEMENTATION_COMPLETION_REPORT.md` for severity and remediation details.

## Threat model limitations

This is not a complete forensic erasure tool, a malware scanner, or a guarantee of steganographic undetectability. Browser extensions, compromised browsers, operating-system malware, screenshots, clipboard access, and external map requests are outside the application guarantee.

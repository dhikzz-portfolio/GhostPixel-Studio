# Troubleshooting

## `npm install` fails

- Confirm Node.js and npm are installed.
- Remove neither lockfiles nor source files blindly.
- Retry from `C:/Users/HW-02/ghostpixel-studio`.

## Build fails

```bash
npm run build
```

Read the first TypeScript error. Do not suppress type checking to bypass it.

## Tests fail

Run the smallest relevant suite:

```bash
npm test -- --run tests/validation.test.ts
npm test -- --run tests/crypto.integration.test.ts
npm test -- --run tests/core.test.ts
```

## Image rejected

Check all of the following:

- File is not empty.
- File is below 50 MB.
- Extension is JPEG, PNG, or WebP.
- MIME type agrees with extension.
- Magic bytes agree with extension.
- Browser can decode the image.

An extension rename does not change the binary format.

## GPS map is blank

- Confirm the parsed coordinates are valid.
- Confirm the browser has network access for OpenStreetMap tiles.
- The local coordinate panel should remain available even if tiles fail.
- Map tiles may be blocked by content security policy, ad blockers, or network restrictions.

## Stego decode fails

- Use the original passphrase exactly.
- Upload the generated PNG, not JPEG.
- Do not recompress or edit the stego image.
- Confirm the packet was not truncated.
- A wrong passphrase and tampered ciphertext intentionally produce the same generic authentication failure.

## ExifTool report cannot be generated

Install ExifTool separately and confirm it is on PATH:

```bash
exiftool -ver
```

Then follow `EXIFTOOL_VERIFICATION_REPORT.md`.

## Browser tests cannot start

Install Playwright browser binaries:

```bash
npm run test:e2e:install
```

If a browser download is blocked, report the affected browser as BLOCKED or NOT RUN, never PASS.

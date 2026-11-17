# Browser Compatibility

## Target APIs

- File and Blob APIs.
- Canvas 2D.
- Image decoding.
- Web Crypto SubtleCrypto.
- Object URLs.
- Leaflet DOM rendering.

## Planned test targets

- Chromium/Chrome.
- Firefox.
- WebKit as a Safari compatibility proxy.
- Safari itself should be tested separately when available.

## Playwright setup

```bash
npm run test:e2e:install
npm run test:e2e
```

The Playwright projects are defined in `playwright.config.ts`. Browser test definitions being discoverable is not equivalent to successful browser execution.

## Fallback behavior

- Canvas context failure is surfaced to the user.
- Image decode failure is surfaced as an invalid/corrupt image error.
- Leaflet tile failure should not remove the locally displayed coordinates.
- WebP output depends on browser encoder support.
- `createImageBitmap` is not required by the current fallback image loading path.

## Known compatibility limitations

- Download behavior varies between browsers and security contexts.
- External map tiles require network access.
- Safari/WebKit behavior must be verified with actual execution before being marked PASS.
- Large images can consume substantial browser memory despite the file-size limit.

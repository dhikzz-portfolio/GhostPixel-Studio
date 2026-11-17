# LSB Steganography

## Encoding model

The encoder operates on `ImageData` and uses one least-significant bit from each RGB channel:

```text
R, G, B = 3 payload bits per pixel
A       = unchanged
```

Bits are written most-significant-bit first within each byte. Decoder extraction uses the same order.

The source `ImageData` is copied before modification.

## Capacity

```text
floor(width × height × 3 / 8) - 36 bytes
```

The 36-byte subtraction accounts for the fixed GHST header. The encrypted payload also includes the 16-byte GCM authentication tag, so plaintext capacity is lower than the displayed ciphertext capacity.

Negative capacity is clamped to zero.

## Output format

Stego output must be PNG. JPEG is lossy and can alter LSBs during encoding, destroying the packet.

## Decoder flow

1. Read the first 36 bytes from RGB LSBs.
2. Validate `GHST`.
3. Read the 32-bit big-endian ciphertext length.
4. Validate the length against image capacity.
5. Read exactly the packet bytes.
6. Pass the packet to the GHST parser.
7. Authenticate and decrypt with AES-GCM.
8. Display plaintext only after successful authentication.

The header is not read twice and the bit offset remains continuous.

## Visual analysis

VisualDiff provides:

- Side-by-side previews.
- Changed pixel count.
- Changed RGB channel count.
- RGB MSE.
- RGB PSNR.
- Processed-image RGB histogram.

Alpha is excluded from MSE and PSNR. A zero MSE produces an identical result rather than a finite PSNR number.

PSNR and histogram similarity do not prove that a payload is undetectable or that metadata has been removed.

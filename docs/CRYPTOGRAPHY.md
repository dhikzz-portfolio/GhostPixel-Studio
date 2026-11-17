# Cryptography

## Primitives

GhostPixel Studio uses browser-native Web Crypto:

- Key derivation: PBKDF2.
- Hash: SHA-256.
- Baseline iterations: 100,000.
- Salt: 16 cryptographically random bytes.
- Encryption: AES-GCM.
- Key size: 256 bits.
- IV: 12 cryptographically random bytes.
- Authentication tag: 128 bits, supplied by AES-GCM.

`crypto.getRandomValues()` generates salt and IV. `Math.random()` is not used for cryptographic values.

## Passphrase behavior

- Empty passphrases are rejected.
- Passphrases are not transmitted.
- Passphrases are not stored in localStorage.
- Passphrases are not written to application logs.
- The UI may keep the entered value in transient React state while the user is working.

The strength indicator, where shown, is guidance and not a security guarantee.

## GHST packet format

| Offset | Field | Size |
|---:|---|---:|
| 0 | Magic `GHST` | 4 bytes |
| 4 | Salt | 16 bytes |
| 20 | IV | 12 bytes |
| 32 | Ciphertext + tag length | 4 bytes |
| 36 | Ciphertext + tag | Variable |

The length is an unsigned 32-bit big-endian integer. The length includes the AES-GCM authentication tag.

## Validation

Before decryption the decoder verifies:

- Minimum fixed header size.
- Magic header.
- Payload length minimum.
- Payload length exactly matches the buffer length.
- Salt and IV boundaries.

Authentication failure produces a generic decryption error. Plaintext is not returned when authentication fails.

## Security limitations

PBKDF2 iteration count is the blueprint baseline and may need future calibration for current hardware. The packet does not provide password recovery. Users are responsible for preserving the passphrase.

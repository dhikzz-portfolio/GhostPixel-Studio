export const PACKET_HEADER_SIZE = 36;
export const PBKDF2_ITERATIONS = 100_000;
export interface PacketFields { salt: Uint8Array; iv: Uint8Array; ciphertext: Uint8Array; }

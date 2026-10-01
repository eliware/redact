export const redactPublicKeyRule = [
  /\b(?:ssh-rsa|ssh-ed25519)\s+[A-Za-z0-9+/=]+(?:\s+\S+)?/gu,
  "[REDACTED]",
];

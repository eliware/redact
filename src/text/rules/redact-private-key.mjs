export const redactPrivateKeyRule = [
  /-----BEGIN [^-]+-----[\s\S]*?-----END [^-]+-----/gu,
  '[REDACTED]',
];

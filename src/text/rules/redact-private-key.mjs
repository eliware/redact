export const redactPrivateKeyRule = [
  /-----BEGIN [\w -]+?-----[\s\S]*?-----END [\w -]+?-----/gu,
  "[REDACTED]",
];

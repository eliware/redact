export const redactOpaqueBase64Rule = [
  /\b(?=[A-Za-z0-9+/]{32,}={0,2}\b)(?=[A-Za-z0-9+/]*[0-9])[A-Za-z0-9+/]{32,}={0,2}\b/gu,
  "[REDACTED]",
];

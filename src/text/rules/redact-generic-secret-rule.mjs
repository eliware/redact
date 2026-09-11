export const redactGenericSecretRule = [
  /((?:[A-Z][A-Z0-9_]{2,})\s*[=:]\s*)(?:"[^"]*"|'[^']*'|[^\s,};&]+)/gu,
  "$1[REDACTED]",
];

export const redactProviderKeyRule = [
  /\b(?:AIza[0-9A-Za-z_-]{20,}|AKIA[0-9A-Z]{16})\b/gu,
  "[REDACTED]",
];

export const redactPublicKeyRule = [
  /\b(?:ssh-rsa|ssh-ed25519)\s+[A-Za-z0-9+/=]+(?:\s+\S+)?/gu,
  "[REDACTED]",
];

export const redactOpaqueSecretRule = [/\b[A-F0-9]{32,}\b/giu, "[REDACTED]"];

export const redactOpaqueBase64Rule = [
  /\b(?=[A-Za-z0-9+/]{32,}={0,2}\b)(?=[A-Za-z0-9+/]*[0-9])[A-Za-z0-9+/]{32,}={0,2}\b/gu,
  "[REDACTED]",
];

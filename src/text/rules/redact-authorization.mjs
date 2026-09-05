export const redactAuthorizationRule = [/(authorization\s*:\s*(?:bearer\s+)?)[^\s,]+/giu, '$1[REDACTED]'];

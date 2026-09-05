export function formatRedactionMarker(marker = '[REDACTED]') {
  return `[${String(marker).replace(/^\[|\]$/g, '')}]`;
}

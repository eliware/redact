export function replaceLiteralSecret(value, secret, marker = '[REDACTED]') {
  const text = String(value ?? '');
  return secret ? text.split(String(secret)).join(marker) : text;
}

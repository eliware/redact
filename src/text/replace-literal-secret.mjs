export function replaceLiteralSecret(value, secret) {
  const text = String(value ?? '');
  return secret ? text.split(String(secret)).join('[REDACTED]') : text;
}

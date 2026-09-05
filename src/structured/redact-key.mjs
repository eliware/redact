export function isRedactedKey(key, policy) {
  return policy.keys.has(String(key).toLowerCase());
}

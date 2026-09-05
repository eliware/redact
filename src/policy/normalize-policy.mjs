import { defaultPolicy } from './default-policy.mjs';

export function normalizePolicy(options = {}) {
  const keys = options.keys ?? options.redactKeys ?? defaultPolicy.keys;
  const normalizedKeys = new Set();
  for (const key of keys) normalizedKeys.add(String(key).toLowerCase());
  return { ...defaultPolicy, ...options, keys: normalizedKeys, marker: options.marker ?? defaultPolicy.marker };
}

import { defaultPolicy } from './default-policy.mjs';
import { readonlySet } from './readonly-set.mjs';

export function normalizePolicy(options = {}) {
  const keys = options.keys ?? options.redactKeys ?? defaultPolicy.keys;
  if (keys == null || typeof keys[Symbol.iterator] !== 'function') throw new TypeError('Redaction policy keys must be iterable');
  const normalizedKeys = new Set();
  for (const key of keys) normalizedKeys.add(String(key).toLowerCase());
  return { ...defaultPolicy, ...options, keys: readonlySet(normalizedKeys), marker: options.marker ?? defaultPolicy.marker };
}

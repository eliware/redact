import { defaultPolicy } from './default-policy.mjs';
import { readonlySet } from './readonly-set.mjs';

export function normalizePolicy(options = {}) {
  const keys = options.keys ?? options.redactKeys ?? defaultPolicy.keys;
  if (keys == null || typeof keys[Symbol.iterator] !== 'function') throw new TypeError('Redaction policy keys must be iterable');
  const normalizedKeys = new Set();
  for (const key of keys) normalizedKeys.add(String(key).toLowerCase());
  for (const name of ['maxArray', 'maxDepth', 'maxKeys']) {
    if (!Number.isInteger(options[name] ?? defaultPolicy[name]) || (options[name] ?? defaultPolicy[name]) < 0) throw new TypeError(`${name} must be a non-negative integer`);
  }
  return { ...defaultPolicy, ...options, keys: readonlySet(normalizedKeys), marker: options.marker ?? defaultPolicy.marker };
}

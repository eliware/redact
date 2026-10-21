import { defaultPolicy } from "./default/policy.mjs";

export function normalizePolicy(options = {}) {
  const keys = options.keys ?? options.redactKeys ?? defaultPolicy.keys;
  const normalizedKeys = new Set();
  for (const key of keys) {
    try {
      normalizedKeys.add(String(key).toLowerCase());
    } catch {
      // Ignore invalid keys that cannot be converted safely.
    }
  }
  return {
    ...defaultPolicy,
    ...options,
    keys: normalizedKeys,
    marker: options.marker ?? defaultPolicy.marker,
  };
}

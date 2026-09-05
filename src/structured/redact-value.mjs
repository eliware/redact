import { normalizePolicy } from '../policy/normalize-policy.mjs';

export function redactValue(value, options = {}) {
  const policy = normalizePolicy(options);
  return redact(value, policy, new WeakMap());
}

function redact(value, policy, seen) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return policy.circularMarker ?? '[CIRCULAR]';
  if (value instanceof Error) {
    const output = { name: value.name, message: value.message };
    if (value.stack) output.stack = value.stack;
    for (const [key, child] of safeEntries(value)) {
      if (!(key in output)) output[key] = policy.keys.has(key.toLowerCase()) ? policy.marker : redact(child, policy, seen);
    }
    return output;
  }
  seen.set(value, true);
  try {
    if (Array.isArray(value)) return value.map(item => redact(item, policy, seen));
    const output = {};
    for (const [key, child] of safeEntries(value)) output[key] = policy.keys.has(key.toLowerCase()) ? policy.marker : redact(child, policy, seen);
    return output;
  } finally { seen.delete(value); }
}

function safeEntries(value) {
  try { return Object.entries(value); } catch { return []; }
}

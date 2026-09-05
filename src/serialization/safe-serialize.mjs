import { DEFAULT_LIMITS } from '../limits/default-limits.mjs';
import { normalizePolicy } from '../policy/normalize-policy.mjs';

export function safeSerialize(value, options = {}) {
  const policy = normalizePolicy(options);
  const limits = { ...DEFAULT_LIMITS, ...options };
  return serialize(value, policy, limits, new WeakSet(), 0);
}

function serialize(value, policy, limits, seen, depth) {
  if (value === null) return null;
  if (value === undefined) return '[Undefined]';
  if (typeof value === 'string') return value.length > limits.maxString ? `${value.slice(0, limits.maxString)}...[TRUNCATED]` : value;
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
  if (typeof value === 'symbol') return `[Symbol: ${value.description ?? ''}]`;
  if (typeof value !== 'object') return value;
  if (depth > limits.maxDepth) return '[TRUNCATED]';
  if (seen.has(value)) return '[CIRCULAR]';
  seen.add(value);
  try {
    if (Buffer?.isBuffer?.(value)) return `[Buffer length=${value.length}]`;
    if (value instanceof Error) return serializeError(value, policy, limits, seen, depth);
    if (Array.isArray(value)) return value.slice(0, limits.maxArray).map(item => serialize(item, policy, limits, seen, depth + 1));
    const output = {};
    for (const [index, [key, child]] of safeEntries(value).entries()) {
      if (index >= limits.maxKeys) { output.__truncated = '[TRUNCATED]'; break; }
      output[key] = policy.keys.has(key.toLowerCase()) ? policy.marker : serialize(child, policy, limits, seen, depth + 1);
    }
    return output;
  } catch { return '[UNSERIALIZABLE]'; }
  finally { seen.delete(value); }
}

function serializeError(error, policy, limits, seen, depth) {
  const output = { name: serialize(error.name, policy, limits, seen, depth), message: policy.keys.has('message') ? policy.marker : serialize(error.message, policy, limits, seen, depth) };
  if (error.stack) output.stack = serialize(error.stack, policy, limits, seen, depth);
  for (const [key, child] of safeEntries(error)) if (!(key in output)) output[key] = policy.keys.has(key.toLowerCase()) ? policy.marker : serialize(child, policy, limits, seen, depth + 1);
  return output;
}

function safeEntries(value) {
  try { return Object.entries(value); } catch { return []; }
}

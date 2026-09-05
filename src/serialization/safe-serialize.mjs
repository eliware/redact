import { DEFAULT_LIMITS } from '../limits/default-limits.mjs';
import { enforceDepthLimit } from '../limits/enforce-depth-limit.mjs';
import { enforceStringLimit } from '../limits/enforce-string-limit.mjs';
import { isBuffer } from '../inspection/is-buffer.mjs';
import { isError } from '../inspection/is-error.mjs';
import { readSafeEntries } from '../inspection/read-safe-entries.mjs';
import { normalizePolicy } from '../policy/normalize-policy.mjs';
import { circularValue } from './circular-value.mjs';
import { serializeArray } from './serialize-array.mjs';
import { serializeObject } from './serialize-object.mjs';
import { unserializableValue } from './unserializable-value.mjs';

export function safeSerialize(value, options = {}) {
  const policy = normalizePolicy(options);
  const limits = { ...DEFAULT_LIMITS, ...options };
  return serialize(value, policy, limits, new WeakSet(), 0);
}

function serialize(value, policy, limits, seen, depth) {
  if (value === null) return null;
  if (value === undefined) return '[Undefined]';
  if (typeof value === 'string') return enforceStringLimit(value, limits.maxString);
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
  if (typeof value === 'symbol') return `[Symbol: ${value.description ?? ''}]`;
  if (typeof value !== 'object') return value;
  if (enforceDepthLimit(depth, limits.maxDepth)) return '[TRUNCATED]';
  if (seen.has(value)) return circularValue();
  seen.add(value);
  try {
    if (isBuffer(value)) return `[Buffer length=${value.length}]`;
    if (isError(value)) return serializeError(value, policy, limits, seen, depth);
    if (Array.isArray(value)) return serializeArray(value, limits.maxArray, item => serialize(item, policy, limits, seen, depth + 1));
    return serializeObject(value, limits.maxKeys, (key, child) => policy.keys.has(key.toLowerCase()) ? policy.marker : serialize(child, policy, limits, seen, depth + 1));
  } catch { return unserializableValue(); }
  finally { seen.delete(value); }
}

function serializeError(error, policy, limits, seen, depth) {
  const output = { name: serialize(error.name, policy, limits, seen, depth), message: policy.keys.has('message') ? policy.marker : serialize(error.message, policy, limits, seen, depth) };
  if (error.stack) output.stack = serialize(error.stack, policy, limits, seen, depth);
  for (const [key, child] of readSafeEntries(error)) if (!(key in output)) output[key] = policy.keys.has(key.toLowerCase()) ? policy.marker : serialize(child, policy, limits, seen, depth + 1);
  return output;
}

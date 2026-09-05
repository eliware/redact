import { DEFAULT_LIMITS } from '../limits/default-limits.mjs';
import { enforceDepthLimit } from '../limits/enforce-depth-limit.mjs';
import { isBuffer } from '../inspection/is-buffer.mjs';
import { isError } from '../inspection/is-error.mjs';
import { normalizePolicy } from '../policy/normalize-policy.mjs';
import { circularValue } from './circular-value.mjs';
import { serializeArray } from './serialize-array.mjs';
import { serializeError } from './serialize-error.mjs';
import { serializeObject } from './serialize-object.mjs';
import { serializePrimitive } from './serialize-primitive.mjs';
import { unserializableValue } from './unserializable-value.mjs';

export function safeSerialize(value, options = {}) {
  const policy = normalizePolicy(options);
  const limits = { ...DEFAULT_LIMITS, ...options };
  return serialize(value, policy, limits, new WeakSet(), 0);
}

function serialize(value, policy, limits, seen, depth) {
  const primitive = serializePrimitive(value, limits.maxString);
  if (primitive.handled) return primitive.value;
  if (enforceDepthLimit(depth, limits.maxDepth)) return '[TRUNCATED]';
  if (seen.has(value)) return circularValue();
  seen.add(value);
  try {
    if (isBuffer(value)) return `[Buffer length=${value.length}]`;
    if (isError(value)) return serializeError(value, policy, (child, childDepth) => serialize(child, policy, limits, seen, childDepth), depth);
    if (Array.isArray(value)) return serializeArray(value, limits.maxArray, item => serialize(item, policy, limits, seen, depth + 1));
    return serializeObject(value, limits.maxKeys, (key, child) => policy.keys.has(key.toLowerCase()) ? policy.marker : serialize(child, policy, limits, seen, depth + 1));
  } catch { return unserializableValue(); }
  finally { seen.delete(value); }
}

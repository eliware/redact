import { DEFAULT_LIMITS } from '../limits/default-limits.mjs';
import { enforceDepthLimit } from '../limits/enforce-depth-limit.mjs';
import { isBuffer } from '../inspection/is-buffer.mjs';
import { isError } from '../inspection/is-error.mjs';
import { normalizePolicy } from '../policy/normalize-policy.mjs';
import { circularValue } from './circular-value.mjs';
import { serializeArray } from './serialize-array.mjs';
import { serializeError } from './serialize-error.mjs';
import { serializeBuffer } from './serialize-buffer.mjs';
import { serializeObject } from './serialize-object.mjs';
import { unserializableValue } from './unserializable-value.mjs';
import { serializeValue } from './serialize-value.mjs';
import { normalizeSerializationLimits } from './serialization-limits.mjs';

export function safeSerialize(value, options = {}) {
  const policy = normalizePolicy(options);
  const limits = normalizeSerializationLimits(options, DEFAULT_LIMITS);
  return serialize(value, policy, limits, new WeakSet(), 0);
}

function serialize(value, policy, limits, seen, depth) {
  try {
    const primitive = serializeValue(value, limits);
    if (primitive.handled) return primitive.value;
    if (enforceDepthLimit(depth, limits.maxDepth)) return '[TRUNCATED]';
    if (seen.has(value)) return circularValue(policy.circularMarker);
    seen.add(value);
    try {
    if (isBuffer(value)) return serializeBuffer(value);
    if (isError(value)) return serializeError(value, policy, (child, childDepth) => serialize(child, policy, limits, seen, childDepth), depth);
    if (Array.isArray(value)) return serializeArray(value, limits.maxArray, item => serialize(item, policy, limits, seen, depth + 1));
    const source = boundedObject(value, limits.maxKeys);
    return serializeObject(source, limits.maxKeys, (key, child) => policy.keys.has(key.toLowerCase()) ? policy.marker : serialize(child, policy, limits, seen, depth + 1));
    } finally { seen.delete(value); }
  } catch { return unserializableValue(); }
}

function boundedObject(value, maxKeys) {
  const output = Object.create(null);
  let keys;
  try { keys = Object.keys(value); } catch { return output; }
  for (const [index, key] of keys.entries()) {
    if (index >= maxKeys) {
      let marker = '__truncated';
      while (Object.hasOwn(output, marker)) marker = `_${marker}`;
      output[marker] = '[TRUNCATED]';
      return output;
    }
    try {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (descriptor && 'value' in descriptor) output[key] = descriptor.value;
    } catch { /* omit hostile property */ }
  }
  return output;
}

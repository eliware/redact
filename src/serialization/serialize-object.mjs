import { enforceKeyLimit } from '../limits/enforce-key-limit.mjs';
import { readSafeEntries } from '../inspection/read-safe-entries.mjs';
import { unserializableValue } from './unserializable-value.mjs';

export function serializeObject(value, maxKeys, serializeProperty, truncatedMarker = '[TRUNCATED]') {
  const output = Object.create(null);
  for (const [index, [key, child]] of readSafeEntries(value).entries()) {
    if (enforceKeyLimit(index, maxKeys)) {
      let key = '__truncated';
      while (Object.hasOwn(output, key)) key = `_${key}`;
      output[key] = truncatedMarker;
      break;
    }
    try { output[key] = serializeProperty(key, child); } catch { output[key] = unserializableValue(); }
  }
  return output;
}

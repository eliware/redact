import { enforceArrayLimit } from '../limits/enforce-array-limit.mjs';
import { unserializableValue } from './unserializable-value.mjs';

export function serializeArray(value, maxArray, serializeItem) {
  const output = enforceArrayLimit(value, maxArray).map(item => {
    try { return serializeItem(item); } catch { return unserializableValue(); }
  });
  if (value.length > maxArray) output.push('[TRUNCATED]');
  return output;
}

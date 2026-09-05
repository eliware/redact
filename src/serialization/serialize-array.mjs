import { enforceArrayLimit } from '../limits/enforce-array-limit.mjs';

export function serializeArray(value, maxArray, serializeItem) {
  const output = enforceArrayLimit(value, maxArray).map(serializeItem);
  if (value.length > maxArray) output.push('[TRUNCATED]');
  return output;
}

import { enforceArrayLimit } from '../limits/enforce-array-limit.mjs';

export function serializeArray(value, maxArray, serializeItem) {
  return enforceArrayLimit(value, maxArray).map(serializeItem);
}

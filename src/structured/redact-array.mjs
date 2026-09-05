import { redactProperty } from './redact-property.mjs';

export function redactArray(value, policy, redactChild) {
  let limit;
  try { limit = policy.maxArray ?? value.length; }
  catch { return []; }
  if (!Number.isInteger(limit) || limit < 0) throw new TypeError('maxArray must be a non-negative integer');
  let output;
  let truncated;
  try { output = value.slice(0, limit).map(item => redactProperty('', item, policy, () => redactChild(item))); truncated = value.length > limit; }
  catch { return []; }
  if (truncated) output.push('[TRUNCATED]');
  return output;
}

import { redactProperty } from './redact-property.mjs';

export function redactArray(value, policy, redactChild) {
  const limit = policy.maxArray ?? value.length;
  if (!Number.isInteger(limit) || limit < 0) throw new TypeError('maxArray must be a non-negative integer');
  let output;
  try { output = value.slice(0, limit).map(item => redactProperty('', item, policy, () => redactChild(item))); }
  catch { return []; }
  if (value.length > limit) output.push('[TRUNCATED]');
  return output;
}

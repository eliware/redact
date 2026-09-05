import { redactProperty } from './redact-property.mjs';

export function redactArray(value, policy, redactChild) {
  let limit;
  try { limit = policy.maxArray ?? value.length; }
  catch { return []; }
  if (!Number.isInteger(limit) || limit < 0) throw new TypeError('maxArray must be a non-negative integer');
  let items;
  let truncated;
  try { items = value.slice(0, limit); truncated = value.length > limit; }
  catch { return []; }
  if (!Array.isArray(items)) return [];
  const output = items.map(item => {
    try { return redactProperty('', item, policy, () => redactChild(item)); }
    catch { return '[UNSERIALIZABLE]'; }
  });
  if (truncated) output.push('[TRUNCATED]');
  return output;
}

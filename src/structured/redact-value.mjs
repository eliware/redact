import { normalizePolicy } from '../policy/normalize-policy.mjs';
import { circularReferenceValue } from './circular-reference-handler.mjs';
import { redactArray } from './redact-array.mjs';
import { redactError } from './redact-error.mjs';
import { redactObject } from './redact-object.mjs';

export function redactValue(value, options = {}) {
  const policy = normalizePolicy(options);
  return redact(value, policy, new WeakMap());
}

function redact(value, policy, seen) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return circularReferenceValue(policy);
  if (value instanceof Error) return redactError(value, policy, child => redact(child, policy, seen));
  seen.set(value, true);
  try { return Array.isArray(value) ? redactArray(value, policy, child => redact(child, policy, seen)) : redactObject(value, policy, child => redact(child, policy, seen)); }
  finally { seen.delete(value); }
}

import { isRedactedKey } from './redact-key.mjs';

export function redactProperty(key, value, policy, redactChild) {
  return isRedactedKey(key, policy) ? policy.marker : redactChild(value);
}

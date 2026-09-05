import { redactProperty } from './redact-property.mjs';

export function redactArray(value, policy, redactChild) {
  return value.map(item => redactProperty('', item, { ...policy, keys: new Set() }, () => redactChild(item)));
}

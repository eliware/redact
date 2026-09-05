import { isSensitiveHeaderName } from './header-name-policy.mjs';

export function redactHeaderValue(name, value, options = {}) {
  return isSensitiveHeaderName(name, options) ? options.marker ?? '[REDACTED]' : value;
}

import { redactText } from '../text/redact-text.mjs';

export function redactErrorMessage(error, options = {}) {
  return redactText(error?.message ?? String(error ?? ''), options);
}

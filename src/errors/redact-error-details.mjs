import { redactValue } from '../structured/redact-value.mjs';

export function redactErrorDetails(error, options = {}) {
  return error?.details === undefined ? undefined : redactValue(error.details, options);
}

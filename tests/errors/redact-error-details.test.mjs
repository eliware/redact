import { redactErrorDetails } from '../../src/errors/redact-error-details.mjs';

test('redacts structured error details', () => {
  expect(redactErrorDetails({ details: { password: 'secret', code: 5 } })).toEqual({ password: '[REDACTED]', code: 5 });
  expect(redactErrorDetails({})).toBeUndefined();
});

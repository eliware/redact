import { redactErrorMessage } from '../../src/errors/redact-error-message.mjs';

test('redacts credential-shaped error messages', () => {
  expect(redactErrorMessage(new Error('token=secret'))).toBe('token=[REDACTED]');
  expect(redactErrorMessage(null)).toBe('');
});

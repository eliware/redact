import { safeErrorValue } from '../../src/errors/safe-error-value.mjs';

test('creates a safe error value', () => {
  expect(safeErrorValue(Object.assign(new Error('token=secret'), { details: { token: 'secret' } }))).toEqual({ name: 'Error', message: 'token=[REDACTED]', details: { token: '[REDACTED]' } });
  expect(safeErrorValue(null)).toEqual({ message: '' });
  expect(safeErrorValue({ message: 'plain', name: undefined })).toEqual({ name: 'Error', message: 'plain' });
});

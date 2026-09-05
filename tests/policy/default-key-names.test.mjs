import { DEFAULT_SENSITIVE_KEYS } from '../../src/policy/default-key-names.mjs';

test('includes common credential keys', () => {
  expect(DEFAULT_SENSITIVE_KEYS.has('token')).toBe(true);
  expect(DEFAULT_SENSITIVE_KEYS.has('password')).toBe(true);
});

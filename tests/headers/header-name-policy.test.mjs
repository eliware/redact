import { isSensitiveHeaderName } from '../../src/headers/header-name-policy.mjs';

test('identifies default and credential-shaped header names', () => {
  expect(isSensitiveHeaderName('AUTHORIZATION')).toBe(true);
  expect(isSensitiveHeaderName('x-custom-token')).toBe(true);
  expect(isSensitiveHeaderName('accept')).toBe(false);
});

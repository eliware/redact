import { SECRET_KEY_PATTERN } from '../../../src/text/patterns/secret-key-patterns.mjs';

test('defines a credential key pattern', () => {
  expect(new RegExp(`^${SECRET_KEY_PATTERN}$`, 'i').test('api-key')).toBe(true);
});

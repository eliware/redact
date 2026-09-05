import { replaceLiteralSecret } from '../../src/text/replace-literal-secret.mjs';

test('replaces literal secrets', () => {
  expect(replaceLiteralSecret('abc abc', 'abc')).toBe('[REDACTED] [REDACTED]');
  expect(replaceLiteralSecret('safe', '')).toBe('safe');
  expect(replaceLiteralSecret(undefined, 'secret')).toBe('');
});

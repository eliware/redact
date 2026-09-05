import { normalizePolicy } from '../../src/policy/normalize-policy.mjs';

test('normalizes aliases and key casing', () => {
  expect(normalizePolicy({ redactKeys: ['API_KEY'] }).keys.has('api_key')).toBe(true);
});

test('uses defaults when options are omitted', () => expect(normalizePolicy().keys.has('token')).toBe(true));

test('rejects non-iterable key collections clearly', () => {
  expect(() => normalizePolicy({ keys: 42 })).toThrow('keys must be iterable');
});

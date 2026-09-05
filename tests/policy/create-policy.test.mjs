import { createPolicy } from '../../src/policy/create-policy.mjs';

test('creates a normalized immutable policy', () => {
  const policy = createPolicy({ keys: ['Token'] });
  expect(policy.keys.has('token')).toBe(true);
  expect(Object.isFrozen(policy)).toBe(true);
});
test('creates the default policy when options are omitted', () => expect(createPolicy().marker).toBe('[REDACTED]'));

test('normalizes custom header names into a canonical readonly set', () => {
  const policy = createPolicy({ headerNames: ['X-CUSTOM', 'Authorization'] });
  expect([...policy.headerNames]).toEqual(['authorization', 'cookie', 'set-cookie', 'proxy-authorization', 'x-api-key', 'x-custom']);
  expect(() => policy.headerNames.add('other')).toThrow();
});

test('rejects non-iterable header names', () => {
  expect(() => createPolicy({ headerNames: 42 })).toThrow('headerNames must be iterable');
});

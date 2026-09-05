import { createPolicy } from '../../src/policy/create-policy.mjs';

test('creates a normalized immutable policy', () => {
  const policy = createPolicy({ keys: ['Token'] });
  expect(policy.keys.has('token')).toBe(true);
  expect(Object.isFrozen(policy)).toBe(true);
});

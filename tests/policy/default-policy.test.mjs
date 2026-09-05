import { defaultPolicy } from '../../src/policy/default-policy.mjs';

test('provides the default marker and key policy', () => {
  expect(defaultPolicy.marker).toBe('[REDACTED]');
  expect(defaultPolicy.keys.has('authorization')).toBe(true);
  expect(defaultPolicy.circularMarker).toBe('[CIRCULAR]');
});

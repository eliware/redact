import { enforceStringLimit } from '../../src/limits/enforce-string-limit.mjs';

test('bounds strings', () => {
  expect(enforceStringLimit('abc', 2)).toBe('ab');
  expect(enforceStringLimit('a'.repeat(25), 20)).toContain('[TRUNCATED]');
  expect(enforceStringLimit('a', 2)).toBe('a');
});

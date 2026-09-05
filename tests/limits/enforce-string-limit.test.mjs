import { enforceStringLimit } from '../../src/limits/enforce-string-limit.mjs';

test('bounds strings', () => {
  expect(enforceStringLimit('abc', 2)).toBe('ab...[TRUNCATED]');
  expect(enforceStringLimit('a', 2)).toBe('a');
});

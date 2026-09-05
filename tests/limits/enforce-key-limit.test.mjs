import { enforceKeyLimit } from '../../src/limits/enforce-key-limit.mjs';

test('checks key bounds', () => {
  expect(enforceKeyLimit(2, 2)).toBe(true);
  expect(enforceKeyLimit(1, 2)).toBe(false);
});

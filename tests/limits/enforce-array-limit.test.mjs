import { enforceArrayLimit } from '../../src/limits/enforce-array-limit.mjs';

test('bounds arrays', () => {
  expect(enforceArrayLimit([1, 2, 3], 2)).toEqual([1, 2]);
});

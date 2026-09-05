import { enforceDepthLimit } from '../../src/limits/enforce-depth-limit.mjs';

test('checks depth bounds', () => {
  expect(enforceDepthLimit(3, 2)).toBe(true);
  expect(enforceDepthLimit(2, 2)).toBe(false);
});

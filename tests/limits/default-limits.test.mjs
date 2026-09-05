import { DEFAULT_LIMITS } from '../../src/limits/default-limits.mjs';

test('provides bounded serialization defaults', () => {
  expect(DEFAULT_LIMITS).toMatchObject({ maxDepth: 20, maxKeys: 1000 });
});

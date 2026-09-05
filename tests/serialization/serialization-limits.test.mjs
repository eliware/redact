import { normalizeSerializationLimits } from '../../src/serialization/serialization-limits.mjs';

test('merges serialization limits', () => expect(normalizeSerializationLimits({ maxDepth: 2 }, { maxDepth: 20, maxKeys: 3 })).toEqual({ maxDepth: 2, maxKeys: 3 }));

test('rejects invalid serialization limits', () => {
  expect(() => normalizeSerializationLimits({ maxString: -1 }, {})).toThrow('maxString must be a non-negative integer');
  expect(() => normalizeSerializationLimits({ maxKeys: 1.5 }, {})).toThrow('maxKeys must be a non-negative integer');
});

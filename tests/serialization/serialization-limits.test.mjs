import { normalizeSerializationLimits } from '../../src/serialization/serialization-limits.mjs';

test('merges serialization limits', () => expect(normalizeSerializationLimits({ maxDepth: 2 }, { maxDepth: 20, maxKeys: 3 })).toEqual({ maxDepth: 2, maxKeys: 3 }));

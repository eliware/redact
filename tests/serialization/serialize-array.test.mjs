import { serializeArray } from '../../src/serialization/serialize-array.mjs';

test('serializes bounded arrays through the callback', () => expect(serializeArray([1, 2], 1, value => value * 2)).toEqual([2, '[TRUNCATED]']));

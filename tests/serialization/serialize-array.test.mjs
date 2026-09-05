import { serializeArray } from '../../src/serialization/serialize-array.mjs';

test('serializes bounded arrays through the callback', () => expect(serializeArray([1, 2], 1, value => value * 2)).toEqual([2, '[TRUNCATED]']));
test('uses a local fallback when an item callback fails', () => expect(serializeArray([1], 1, () => { throw new Error('blocked'); })).toEqual(['[UNSERIALIZABLE]']));

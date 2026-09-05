import { unserializableValue } from '../../src/serialization/unserializable-value.mjs';

test('returns the unserializable marker', () => expect(unserializableValue()).toBe('[UNSERIALIZABLE]'));

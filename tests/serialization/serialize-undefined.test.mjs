import { serializeUndefined } from '../../src/serialization/serialize-undefined.mjs';

test('serializes undefined', () => expect(serializeUndefined()).toBe('[Undefined]'));

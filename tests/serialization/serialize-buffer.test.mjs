import { serializeBuffer } from '../../src/serialization/serialize-buffer.mjs';

test('serializes buffer metadata', () => expect(serializeBuffer(Buffer.from('abc'))).toBe('[Buffer length=3]'));

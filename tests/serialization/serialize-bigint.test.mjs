import { serializeBigInt } from '../../src/serialization/serialize-bigint.mjs';

test('serializes BigInts', () => expect(serializeBigInt(2n)).toBe('2n'));

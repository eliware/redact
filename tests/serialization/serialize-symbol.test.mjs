import { serializeSymbol } from '../../src/serialization/serialize-symbol.mjs';

test('serializes symbols', () => expect(serializeSymbol(Symbol('x'))).toBe('[Symbol: x]'));

import { serializePrimitive } from '../../src/serialization/serialize-primitive.mjs';

test('serializes primitive and callable values', () => {
  expect(serializePrimitive(null, 5)).toEqual({ handled: true, value: null });
  expect(serializePrimitive(undefined, 5).value).toBe('[Undefined]');
  expect(serializePrimitive('abcdef', 3).value).toBe('abc...[TRUNCATED]');
  expect(serializePrimitive(2n, 5).value).toBe('2n');
  expect(serializePrimitive(function named() {}, 5).value).toBe('[Function: named]');
  expect(serializePrimitive(Symbol(), 5).value).toBe('[Symbol: ]');
  expect(serializePrimitive(4, 5)).toEqual({ handled: true, value: 4 });
  expect(serializePrimitive({}, 5).handled).toBe(false);
});

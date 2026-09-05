import { serializeFunction } from '../../src/serialization/serialize-function.mjs';

test('serializes named and anonymous functions', () => {
  expect(serializeFunction(function named() {})).toBe('[Function: named]');
  expect(serializeFunction(() => {})).toBe('[Function: anonymous]');
});

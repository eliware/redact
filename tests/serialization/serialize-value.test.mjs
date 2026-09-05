import { serializeValue } from '../../src/serialization/serialize-value.mjs';

test('dispatches value serialization with configured limits', () => {
  expect(serializeValue('abcdef', { maxString: 3 }).value).toBe('abc');
  expect(serializeValue({}, { maxString: 3 }).handled).toBe(false);
  expect(serializeValue(undefined).value).toBe('[Undefined]');
});

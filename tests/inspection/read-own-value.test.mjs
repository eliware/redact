import { readOwnValue } from '../../src/inspection/read-own-value.mjs';

test('reads data properties without invoking accessors', () => {
  expect(readOwnValue({ value: 2 }, 'value')).toBe(2);
  expect(readOwnValue({ get value() { return 3; } }, 'value')).toBeUndefined();
  expect(readOwnValue(new Proxy({}, { getOwnPropertyDescriptor() { throw new Error('blocked'); } }), 'value')).toBeUndefined();
});

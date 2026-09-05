import { isPlainObject } from '../../src/inspection/is-plain-object.mjs';

test('identifies plain and null-prototype objects', () => {
  expect(isPlainObject({})).toBe(true);
  expect(isPlainObject(Object.create(null))).toBe(true);
  expect(isPlainObject(new Date())).toBe(false);
  expect(isPlainObject(null)).toBe(false);
  expect(isPlainObject('x')).toBe(false);
});

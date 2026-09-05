import { isObjectLike } from '../../src/inspection/is-object-like.mjs';

test('identifies object-like values', () => {
  expect(isObjectLike({})).toBe(true);
  expect(isObjectLike(null)).toBe(false);
  expect(isObjectLike('value')).toBe(false);
});

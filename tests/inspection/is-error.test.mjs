import { isError } from '../../src/inspection/is-error.mjs';

test('identifies errors', () => {
  expect(isError(new Error())).toBe(true);
  expect(isError({})).toBe(false);
});

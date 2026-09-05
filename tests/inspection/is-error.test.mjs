import vm from 'node:vm';
import { isError } from '../../src/inspection/is-error.mjs';

test('recognizes local and cross-realm errors', () => {
  expect(isError(new Error('x'))).toBe(true);
  expect(isError(vm.runInNewContext('new Error("x")'))).toBe(true);
  expect(isError(null)).toBe(false);
  expect(isError(new Proxy({}, { getPrototypeOf() { throw new Error('blocked'); } }))).toBe(false);
});

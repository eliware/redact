import { isBuffer } from '../../src/inspection/is-buffer.mjs';

test('identifies buffers', () => {
  expect(isBuffer(Buffer.from('x'))).toBe(true);
  expect(isBuffer('x')).toBe(false);
});

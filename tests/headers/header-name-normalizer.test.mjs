import { normalizeHeaderNames } from '../../src/headers/header-name-normalizer.mjs';

test('normalizes default and custom header names', () => {
  expect([...normalizeHeaderNames(['X-CUSTOM'])]).toContain('x-custom');
  expect([...normalizeHeaderNames()]).toContain('authorization');
});

test('rejects non-iterable header names', () => {
  expect(() => normalizeHeaderNames(42)).toThrow('headerNames must be iterable');
});

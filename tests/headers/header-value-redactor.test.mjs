import { redactHeaderValue } from '../../src/headers/header-value-redactor.mjs';

test('redacts sensitive values and preserves safe values', () => {
  expect(redactHeaderValue('token', 'x', { marker: '<hidden>' })).toBe('<hidden>');
  expect(redactHeaderValue('accept', 'json')).toBe('json');
});

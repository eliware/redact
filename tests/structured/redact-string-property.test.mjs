import { redactStringProperty } from '../../src/structured/redact-string-property.mjs';

test('redacts string properties', () => {
  expect(redactStringProperty('secret', { marker: '[x]' })).toBe('[x]');
  expect(redactStringProperty(2, { marker: '[x]' })).toBe(2);
});

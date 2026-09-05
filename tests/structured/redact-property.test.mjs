import { redactProperty } from '../../src/structured/redact-property.mjs';

test('redacts sensitive properties or delegates safe ones', () => {
  const policy = { keys: new Set(['token']), marker: '[x]' };
  expect(redactProperty('token', 'secret', policy, () => 'safe')).toBe('[x]');
  expect(redactProperty('value', 2, policy, value => value + 1)).toBe(3);
});

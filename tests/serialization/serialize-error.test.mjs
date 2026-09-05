import { serializeError } from '../../src/serialization/serialize-error.mjs';

test('serializes an Error through the supplied callback', () => {
  const error = Object.assign(new Error('failed'), { token: 'secret' });
  const policy = { keys: new Set(['token']), marker: '[REDACTED]' };
  expect(serializeError(error, policy, value => value, 0)).toMatchObject({ name: 'Error', message: 'failed', token: '[REDACTED]' });
});

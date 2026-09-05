import { redactValue } from '../../src/index.mjs';

test('redacts nested sensitive values without mutating input', () => {
  const input = { token: 'secret', nested: { Password: 'pass', ok: 1 }, list: [{ apiKey: 'key' }] };
  expect(redactValue(input)).toEqual({ token: '[REDACTED]', nested: { Password: '[REDACTED]', ok: 1 }, list: [{ apiKey: '[REDACTED]' }] });
  expect(input.token).toBe('secret');
});

test('handles cycles and Errors', () => {
  const input = { error: Object.assign(new Error('failed'), { token: 'secret' }) };
  input.self = input;
  expect(redactValue(input).self).toBe('[CIRCULAR]');
  expect(redactValue(input).error).toMatchObject({ message: 'failed', token: '[REDACTED]' });
});

test('handles objects whose entry enumeration throws', () => {
  const value = new Proxy({}, { ownKeys() { throw new Error('blocked'); } });
  expect(redactValue(value)).toEqual({});
});

test('handles an error without a stack and extra fields', () => {
  const error = Object.assign(new Error('failed'), { stack: '', name: 'CustomError', message: 'updated', detail: 'safe' });
  expect(redactValue(error)).toMatchObject({ name: 'CustomError', message: 'updated', detail: 'safe' });
  expect(redactValue({ error })).toBeTruthy();
});

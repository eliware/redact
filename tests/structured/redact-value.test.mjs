import { redactValue } from '../../src/index.mjs';
import vm from 'node:vm';

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

test('supports a custom circular marker through the public API', () => {
  const input = {};
  input.self = input;
  expect(redactValue(input, { circularMarker: '<cycle>' }).self).toBe('<cycle>');
});

test('redacts configured Error metadata fields', () => {
  const error = Object.assign(new Error('token=secret'), { stack: 'stack secret' });
  expect(redactValue(error, { keys: ['message', 'stack'] })).toMatchObject({ message: '[REDACTED]', stack: '[REDACTED]' });
});

test('handles hostile Error property reads', () => {
  const error = new Proxy(new Error('failed'), { get(target, key) { if (key === 'message') throw new Error('blocked'); return Reflect.get(target, key); } });
  expect(redactValue(error)).toBeTruthy();
});

test('handles cycles rooted at Errors', () => {
  const error = new Error('failed');
  error.self = error;
  expect(redactValue(error).self).toBe('[CIRCULAR]');
});

test('redacts cross-realm Errors', () => {
  expect(redactValue(vm.runInNewContext('new Error("failed")'))).toMatchObject({ name: 'Error', message: 'failed' });
});

test('omits symbol-keyed values from safe output', () => {
  const secret = Symbol('secret');
  const value = { safe: true, [secret]: 'credential' };
  const output = redactValue(value);
  expect(Object.getOwnPropertySymbols(output)).toHaveLength(0);
  expect(output.safe).toBe(true);
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

test('bounds structured object keys', () => {
  const value = Object.fromEntries(Array.from({ length: 3 }, (_, index) => [`key${index}`, index]));
  const output = redactValue(value, { maxKeys: 2 });
  expect(output.key0).toBe(0);
  expect(output.key1).toBe(1);
  expect(output.__truncated).toBe('[TRUNCATED]');
});

test('bounds structured recursion depth', () => {
  const value = { child: { value: 1 } };
  expect(redactValue(value, { maxDepth: 0 }).child).toBe('[TRUNCATED]');
});

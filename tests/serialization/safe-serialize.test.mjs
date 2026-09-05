import { safeSerialize } from '../../src/serialization/safe-serialize.mjs';

test('serializes primitives and redacts nested keys', () => {
  expect(safeSerialize({ token: 'secret', nested: { id: 2 }, big: 2n })).toEqual({ token: '[REDACTED]', nested: { id: 2 }, big: '2n' });
  expect(safeSerialize(null)).toBeNull();
  expect(safeSerialize('ok')).toBe('ok');
  expect(safeSerialize('abcdef', { maxString: 3 })).toBe('abc...[TRUNCATED]');
});

test('handles complex values and limits', () => {
  const value = { fn() {}, symbol: Symbol('x'), undefined, buffer: Buffer.from('abc'), long: 'abcdef' };
  value.self = value;
  expect(safeSerialize(value, { maxString: 3 })).toMatchObject({ fn: '[Function: fn]', symbol: '[Symbol: x]', undefined: '[Undefined]', buffer: '[Buffer length=3]', self: '[CIRCULAR]' });
  expect(safeSerialize({ deep: { value: 1 } }, { maxDepth: 0 }).deep).toBe('[TRUNCATED]');
  expect(safeSerialize([1, { token: 'secret' }])).toEqual([1, { token: '[REDACTED]' }]);
  expect(safeSerialize(function () {})).toBe('[Function: anonymous]');
  expect(safeSerialize(Symbol())).toBe('[Symbol: ]');
});

test('serializes Errors and bounded objects', () => {
  const error = Object.assign(new Error('failed'), { token: 'secret', extra: true });
  expect(safeSerialize(error)).toMatchObject({ name: 'Error', message: 'failed', token: '[REDACTED]', extra: true });
  expect(safeSerialize(error, { keys: ['message'] }).message).toBe('[REDACTED]');
  expect(safeSerialize({ a: 1, b: 2 }, { maxKeys: 1 }).__truncated).toBe('[TRUNCATED]');
  const noStack = Object.assign(new Error('plain'), { stack: '' });
  expect(safeSerialize(noStack)).toMatchObject({ message: 'plain' });
  const named = Object.assign(new Error('plain'), { name: 'Named', message: 'changed' });
  expect(safeSerialize(named)).toMatchObject({ name: 'Named', message: 'changed' });
  expect(safeSerialize({ get bad() { throw new Error('blocked'); } })).toEqual({});
  expect(safeSerialize(new Proxy({}, { ownKeys() { throw new Error('blocked'); } }))).toEqual({});
  const hostileError = new Proxy(new Error('blocked'), { get(target, key) { if (key === 'name') throw new Error('blocked'); return Reflect.get(target, key); } });
  expect(safeSerialize(hostileError)).toBe('[UNSERIALIZABLE]');
});

import { safeSerialize } from '../../src/serialization/safe-serialize.mjs';

test('serializes primitives and redacts nested keys', () => {
  expect(safeSerialize({ token: 'secret', nested: { id: 2 }, big: 2n })).toEqual({ token: '[REDACTED]', nested: { id: 2 }, big: '2n' });
  expect(safeSerialize(null)).toBeNull();
  expect(safeSerialize('ok')).toBe('ok');
  expect(safeSerialize('abcdef', { maxString: 3 })).toBe('abc...[TRUNCATED]');
  expect(safeSerialize('a'.repeat(10001), { maxString: undefined })).toContain('[TRUNCATED]');
});

test('handles complex values and limits', () => {
  const value = { fn() {}, symbol: Symbol('x'), undefined, buffer: Buffer.from('abc'), long: 'abcdef' };
  value.self = value;
  expect(safeSerialize(value, { maxString: 3 })).toMatchObject({ fn: '[Function: fn]', symbol: '[Symbol: x]', undefined: '[Undefined]', buffer: '[Buffer length=3]', self: '[CIRCULAR]' });
  expect(safeSerialize({ deep: { value: 1 } }, { maxDepth: 0 }).deep).toBe('[TRUNCATED]');
  expect(safeSerialize([1, { token: 'secret' }])).toEqual([1, { token: '[REDACTED]' }]);
  expect(safeSerialize([1, 2, 3], { maxArray: 2 })).toEqual([1, 2, '[TRUNCATED]']);
  expect(safeSerialize(function () {})).toBe('[Function: anonymous]');
  expect(safeSerialize(Symbol())).toBe('[Symbol: ]');
});

test('uses the configured circular marker and validates limits', () => {
  const value = {};
  value.self = value;
  expect(safeSerialize(value, { circularMarker: '<cycle>' }).self).toBe('<cycle>');
  expect(() => safeSerialize({}, { maxDepth: -1 })).toThrow('maxDepth must be a non-negative integer');
});

test('serializes Errors and bounded objects', () => {
  const error = Object.assign(new Error('failed'), { token: 'secret', extra: true });
  expect(safeSerialize(error)).toMatchObject({ name: 'Error', message: 'failed', token: '[REDACTED]', extra: true });
  expect(safeSerialize(error, { keys: ['message'] }).message).toBe('[REDACTED]');
  expect(safeSerialize({ a: 1, b: 2 }, { maxKeys: 1 }).__truncated).toBe('[TRUNCATED]');
  expect(safeSerialize({ __truncated: 'keep', a: 1 }, { maxKeys: 1 }).___truncated).toBe('[TRUNCATED]');
  const noStack = Object.assign(new Error('plain'), { stack: '' });
  expect(safeSerialize(noStack)).toMatchObject({ message: 'plain' });
  const named = Object.assign(new Error('plain'), { name: 'Named', message: 'changed' });
  expect(safeSerialize(named)).toMatchObject({ name: 'Named', message: 'changed' });
  expect(safeSerialize({ get bad() { throw new Error('blocked'); } })).toEqual({});
  expect(safeSerialize(new Proxy({}, { ownKeys() { throw new Error('blocked'); } }))).toEqual({});
  const hostileError = new Proxy(new Error('blocked'), { get(target, key) { if (key === 'name') throw new Error('blocked'); return Reflect.get(target, key); } });
  expect(safeSerialize(hostileError)).toBe('[UNSERIALIZABLE]');
  expect(safeSerialize(new Date())).toEqual({});
  class Record { constructor() { this.value = 2; } }
  expect(safeSerialize(new Record())).toEqual({ value: 2 });
});

test('propagates child depth when serializing Error metadata', () => {
  const error = Object.assign(new Error('failed'), { detail: { value: 1 } });
  expect(safeSerialize({ error }, { maxDepth: 1 }).error.message).toBe('failed');
});

test('omits non-plain proxy state when key enumeration fails', () => {
  const value = new Proxy(new (class Record {})(), { ownKeys() { throw new Error('blocked'); } });
  expect(safeSerialize(value)).toEqual({});
});

test('does not invoke enumerable getters on plain objects', () => {
  let invoked = false;
  const value = {};
  Object.defineProperty(value, 'token', { enumerable: true, get() { invoked = true; return 'secret'; } });
  expect(safeSerialize(value)).toEqual({});
  expect(invoked).toBe(false);
});

test('bounds large plain objects and records truncation', () => {
  const value = Object.fromEntries(Array.from({ length: 1001 }, (_, index) => [`key${index}`, index]));
  const output = safeSerialize(value);
  expect(output.key0).toBe(0);
  expect(output.key999).toBe(999);
  expect(output.__truncated).toBe('[TRUNCATED]');
  expect(output.key1000).toBeUndefined();
  expect(Object.values(output).filter(value => value === '[TRUNCATED]')).toHaveLength(1);
});

test('redacts Error stack when configured as sensitive', () => {
  const error = new Error('failed');
  expect(safeSerialize(error, { keys: ['stack'] }).stack).toBe('[REDACTED]');
});

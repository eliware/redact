import { redactHeaders } from '../../src/index.mjs';

test('redacts sensitive headers and preserves safe headers', () => {
  expect(redactHeaders({ Authorization: 'Bearer secret', Accept: 'application/json' })).toEqual({ Authorization: '[REDACTED]', Accept: 'application/json' });
});

test('supports Headers and entry arrays', () => {
  expect(redactHeaders(new Headers({ token: 'secret', accept: 'json' }))).toEqual({ token: '[REDACTED]', accept: 'json' });
  expect(redactHeaders([['password', 'secret'], ['x-id', '7']])).toEqual([['password', '[REDACTED]'], ['x-id', '7']]);
});

test('handles null input', () => {
  expect(redactHeaders(null)).toEqual({});
});

test('handles a Headers-like object whose iterator throws', () => {
  expect(redactHeaders({ entries() { throw new Error('blocked'); } })).toEqual({});
});

test('skips malformed entry arrays', () => {
  expect(redactHeaders([['accept', 'json'], ['broken']])).toEqual([['accept', 'json']]);
});

test('can disable heuristic header matching', () => {
  expect(redactHeaders({ token: 'value' }, { matchHeuristics: false })).toEqual({ token: 'value' });
});

test('custom header names remain additive to heuristics', () => {
  expect(redactHeaders({ token: 'secret', 'x-custom': 'secret' }, { headerNames: ['x-custom'] })).toEqual({ token: '[REDACTED]', 'x-custom': '[REDACTED]' });
});

test('custom names retain built-in sensitive names when heuristics are disabled', () => {
  expect(redactHeaders({ authorization: 'secret', 'x-custom': 'secret' }, { headerNames: ['x-custom'], matchHeuristics: false })).toEqual({ authorization: '[REDACTED]', 'x-custom': '[REDACTED]' });
});

test('rejects non-iterable custom header names', () => {
  expect(() => redactHeaders({}, { headerNames: 42 })).toThrow('headerNames must be iterable');
  expect(() => redactHeaders({}, { headerNames: 'authorization' })).toThrow('headerNames must be iterable');
});

test('omits non-string header names', () => {
  expect(redactHeaders([[Symbol('header'), 'value'], ['accept', 'json']])).toEqual([['accept', 'json']]);
  expect(redactHeaders({ [Symbol('header')]: 'value', accept: 'json' })).toEqual({ accept: 'json' });
});

test('handles hostile object-form headers', () => {
  const value = new Proxy({}, { ownKeys() { throw new Error('blocked'); } });
  expect(redactHeaders(value)).toEqual({});
});

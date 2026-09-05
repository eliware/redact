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

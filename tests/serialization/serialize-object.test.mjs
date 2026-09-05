import { serializeObject } from '../../src/serialization/serialize-object.mjs';

test('serializes bounded object properties through the callback', () => expect(serializeObject({ a: 1, b: 2 }, 1, (key, value) => `${key}:${value}`)).toEqual({ a: 'a:1', __truncated: '[TRUNCATED]' }));
test('uses a collision-safe truncation key', () => expect(serializeObject({ __truncated: 'keep', extra: true }, 1, (key, value) => value)).toEqual({ __truncated: 'keep', ___truncated: '[TRUNCATED]' }));

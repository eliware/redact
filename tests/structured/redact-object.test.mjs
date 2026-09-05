import { redactObject } from '../../src/structured/redact-object.mjs';

test('redacts object properties through the callback', () => expect(redactObject({ a: 1 }, { keys: new Set(), marker: '[x]' }, value => value + 1)).toEqual({ a: 2 }));
test('uses a collision-safe truncation key', () => expect(redactObject({ __truncated: 'keep', extra: true }, { keys: new Set(), marker: '[x]', maxKeys: 1 }, value => value)).toEqual({ __truncated: 'keep', ___truncated: '[TRUNCATED]' }));

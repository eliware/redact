import { redactObject } from '../../src/structured/redact-object.mjs';

test('redacts object properties through the callback', () => expect(redactObject({ a: 1 }, { keys: new Set(), marker: '[x]' }, value => value + 1)).toEqual({ a: 2 }));

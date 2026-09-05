import { redactError } from '../../src/structured/redact-error.mjs';

test('redacts Error properties', () => expect(redactError(Object.assign(new Error('x'), { token: 'secret' }), { keys: new Set(['token']), marker: '[x]' }, value => value)).toMatchObject({ token: '[x]' }));

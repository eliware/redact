import { redactArray } from '../../src/structured/redact-array.mjs';

test('redacts array children through the callback', () => expect(redactArray([1, 2], { keys: new Set(), marker: '[x]' }, value => value * 2)).toEqual([2, 4]));

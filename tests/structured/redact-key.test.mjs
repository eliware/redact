import { isRedactedKey } from '../../src/structured/redact-key.mjs';

test('matches keys case-insensitively', () => expect(isRedactedKey('TOKEN', { keys: new Set(['token']) })).toBe(true));

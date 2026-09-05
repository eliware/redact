import { redactJwtRule } from '../../../src/text/rules/redact-jwt.mjs';

test('defines a JWT rule', () => expect('eyJabcde.abcde.abcde'.replace(...redactJwtRule)).toBe('[REDACTED]'));

import { redactPrivateKeyRule } from '../../../src/text/rules/redact-private-key.mjs';

test('defines a private-key rule', () => expect('-----BEGIN KEY-----x-----END KEY-----'.replace(...redactPrivateKeyRule)).toBe('[REDACTED]'));

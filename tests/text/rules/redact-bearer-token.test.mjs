import { redactBearerTokenRule } from '../../../src/text/rules/redact-bearer-token.mjs';

test('defines a bearer rule', () => expect('Bearer x'.replace(...redactBearerTokenRule)).toBe('Bearer [REDACTED]'));

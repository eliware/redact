import { redactAuthorizationRule } from '../../../src/text/rules/redact-authorization.mjs';

test('defines an authorization rule', () => expect('Authorization: Bearer x'.replace(...redactAuthorizationRule)).toBe('Authorization: Bearer [REDACTED]'));

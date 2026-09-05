import { redactQuerySecretRule } from '../../../src/text/rules/redact-query-secret.mjs';

test('defines a query secret rule', () => expect('?token=x'.replace(...redactQuerySecretRule)).toBe('?token=[REDACTED]'));

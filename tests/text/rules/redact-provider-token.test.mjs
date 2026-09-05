import { redactProviderTokenRule } from '../../../src/text/rules/redact-provider-token.mjs';

test('defines a provider token rule', () => expect('ghp_example'.replace(...redactProviderTokenRule)).toBe('[REDACTED]'));

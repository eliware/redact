import { redactNamedAssignmentRule } from '../../../src/text/rules/redact-named-assignment.mjs';

test('defines a named assignment rule', () => expect('token=x'.replace(...redactNamedAssignmentRule)).toBe('token=[REDACTED]'));

import { POLICY_TYPE } from '../../src/policy/policy-types.mjs';

test('identifies the policy type', () => expect(POLICY_TYPE).toBe('redaction-policy'));

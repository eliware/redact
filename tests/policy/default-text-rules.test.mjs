import { DEFAULT_TEXT_RULES } from '../../src/policy/default-text-rules.mjs';

test('lists common text rule families', () => expect(DEFAULT_TEXT_RULES).toContain('token'));

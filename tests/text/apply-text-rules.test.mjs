import { applyTextRules } from '../../src/text/apply-text-rules.mjs';

test('applies text rules in order', () => {
  expect(applyTextRules('secret', [[/secret/gu, 'first'], [/first/gu, 'second']])).toBe('second');
  expect(applyTextRules(undefined, [])).toBe('');
});

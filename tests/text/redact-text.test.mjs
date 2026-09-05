import { redactText, replaceLiteralSecret } from '../../src/index.mjs';

test('redacts common credential-shaped text', () => {
  const output = redactText('Authorization: Bearer abc token=secret ?api_key=key');
  expect(output).not.toContain('abc');
  expect(output).not.toContain('secret');
  expect(output).not.toContain('=key');
});

test('replaces configured literal secrets', () => {
  expect(replaceLiteralSecret('password is abc', 'abc')).toBe('password is [REDACTED]');
});

test('supports configured secrets and empty input', () => {
  expect(redactText('value=known', { secrets: ['known'], marker: '<hidden>' })).toBe('value=<hidden>');
  expect(redactText('value=known', { secrets: ['known'] })).toBe('value=[REDACTED]');
  expect(redactText()).toBe('');
});

test('ignores empty and non-string literal secrets', () => {
  expect(redactText('value=known', { secrets: ['', null, 42] })).toBe('value=known');
});

test('does not rewrite generated markers with later secrets', () => {
  expect(redactText('value=first', { secrets: ['first', '[REDACTED]'] })).toBe('value=[REDACTED]');
});

test('uses a custom marker for built-in text rules', () => {
  expect(redactText('token=secret', { marker: '<hidden>' })).toBe('token=<hidden>');
});

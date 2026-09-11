import { redactText } from '../../../src/index.mjs';

test('redacts generic provider, environment, public-key, and opaque secrets', () => {
  const output = redactText('TOKEN=secret AIza12345678901234567890 ssh-ed25519 AAAAxyz ABCDEF0123456789ABCDEF0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ123456');
  expect(output).not.toContain('secret');
  expect(output).not.toContain('AIza');
  expect(output).not.toContain('ssh-ed25519');
  expect(output).not.toContain('ABCDEF0123456789ABCDEF0123456789');
  expect(output).not.toContain('ABCDEFGHIJKLMNOPQRSTUVWXYZ123456');
});

test('redacts generic Slack and OpenAI provider tokens without over-redacting identifiers', () => {
  const output = redactText('xoxb-123456789012 sk-test_123456789012 ordinary_identifier_123');
  expect(output).not.toContain('xoxb-123456789012');
  expect(output).not.toContain('sk-test_123456789012');
  expect(output).toContain('ordinary_identifier_123');
});

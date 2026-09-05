import { DEFAULT_REDACTION_MARKER } from '../../src/markers/default-marker.mjs';

test('provides the stable default marker', () => {
  expect(DEFAULT_REDACTION_MARKER).toBe('[REDACTED]');
});

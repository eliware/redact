import { formatRedactionMarker } from '../../src/markers/format-redaction-marker.mjs';

test('formats a marker consistently', () => expect(formatRedactionMarker('hidden')).toBe('[hidden]'));
test('uses the default marker', () => expect(formatRedactionMarker()).toBe('[REDACTED]'));

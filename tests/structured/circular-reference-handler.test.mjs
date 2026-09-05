import { circularReferenceValue } from '../../src/structured/circular-reference-handler.mjs';

test('returns the configured circular marker', () => expect(circularReferenceValue({ circularMarker: '[cycle]' })).toBe('[cycle]'));

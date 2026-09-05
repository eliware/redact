import { createMarker } from '../../src/markers/create-marker.mjs';

test('creates a string marker', () => expect(createMarker('hidden')).toBe('hidden'));

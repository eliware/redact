import { circularValue } from '../../src/serialization/circular-value.mjs';

test('returns the circular marker', () => expect(circularValue()).toBe('[CIRCULAR]'));

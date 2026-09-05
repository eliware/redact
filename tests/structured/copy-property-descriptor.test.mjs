import { copyPropertyDescriptor } from '../../src/structured/copy-property-descriptor.mjs';

test('copies an enumerable data property', () => expect(copyPropertyDescriptor({}, 'x', 1).x).toBe(1));

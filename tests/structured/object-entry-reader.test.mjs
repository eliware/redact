import { readObjectEntries } from '../../src/structured/object-entry-reader.mjs';

test('reads structured entries defensively', () => expect(readObjectEntries({ a: 1 })).toEqual([['a', 1]]));

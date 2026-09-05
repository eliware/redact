import { readonlySet } from '../../src/policy/readonly-set.mjs';

test('provides set membership without mutation', () => {
  const values = readonlySet(['token']);
  expect(values.has('token')).toBe(true);
  expect(values.size).toBe(1);
  expect(values.missing).toBeUndefined();
  expect(() => values.add('password')).toThrow('readonly');
  expect(() => values.delete('token')).toThrow('readonly');
});

import { createReadonlySet } from "../../../src/policy/create/readonly-set.mjs";

test("provides the ReadonlySet interface without mutation methods", () => {
  const values = createReadonlySet(["a", "b"]);

  expect(values.size).toBe(2);
  expect(values.has("a")).toBe(true);
  expect(values.has("missing")).toBe(false);
  expect([...values]).toEqual(["a", "b"]);
  expect([...values.keys()]).toEqual(["a", "b"]);
  expect([...values.values()]).toEqual(["a", "b"]);
  expect([...values.entries()]).toEqual([
    ["a", "a"],
    ["b", "b"],
  ]);
  expect(Object.isFrozen(values)).toBe(true);
  expect(values.add).toBeUndefined();
  expect(values.delete).toBeUndefined();
  expect(values.clear).toBeUndefined();
});

test("passes values and the readonly view to forEach with its this argument", () => {
  const values = createReadonlySet(["a"]);
  const context = {};
  let called = false;

  values.forEach(function (value, key, set) {
    called = true;
    expect(this).toBe(context);
    expect([value, key, set]).toEqual(["a", "a", values]);
  }, context);

  expect(called).toBe(true);
});

test("requires a callable forEach callback", () => {
  expect(() => createReadonlySet([]).forEach(null)).toThrow(TypeError);
});

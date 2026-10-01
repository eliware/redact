import { buildHeaderOutput } from "../../src/headers/build-header-output.mjs";

test("preserves array shape and builds null-prototype objects", () => {
  const entries = [["accept", "json"]];
  expect(buildHeaderOutput(entries, entries)).toBe(entries);
  const output = buildHeaderOutput({}, entries);
  expect(output).toEqual({ accept: "json" });
  expect(Object.getPrototypeOf(output)).toBe(null);
});

test("preserves special object header names as own data properties", () => {
  const output = buildHeaderOutput({}, [["__proto__", "value"]]);
  expect(Object.hasOwn(output, "__proto__")).toBe(true);
  expect(output.__proto__).toBe("value");
});

test("uses object output when the input representation is unreadable", () => {
  const { proxy, revoke } = Proxy.revocable([], {});
  revoke();
  expect(buildHeaderOutput(proxy, [])).toEqual(Object.create(null));
});

import { serializeDispatch } from "../../src/serialization/serialize-dispatch.mjs";
test("dispatches primitive serialization", () =>
  expect(
    serializeDispatch(
      "ok",
      { keys: new Set(), circularMarker: "[CIRCULAR]" },
      { maxString: 10, maxDepth: 2 },
      new WeakSet(),
      0,
      serializeDispatch,
    ),
  ).toBe("ok"));
test("returns safe fallback for hostile dispatch", () => {
  const value = new Proxy(
    {},
    {
      ownKeys() {
        throw new Error("blocked");
      },
    },
  );
  expect(
    serializeDispatch(
      value,
      { keys: new Set(), circularMarker: "[CIRCULAR]" },
      { maxDepth: 2, maxKeys: 2 },
      new WeakSet(),
      0,
      serializeDispatch,
    ),
  ).toEqual({});
});
test("returns fallback when policy dispatch fails", () => {
  const policy = {
    keys: {
      has() {
        throw new Error("blocked");
      },
    },
    circularMarker: "[CIRCULAR]",
  };
  expect(
    serializeDispatch(
      { value: 1 },
      policy,
      { maxDepth: 2, maxKeys: 2 },
      new WeakSet(),
      0,
      serializeDispatch,
    ),
  ).toEqual({ value: "[UNSERIALIZABLE]" });
});
test("returns fallback for hostile circular marker access", () => {
  const value = {};
  const seen = new WeakSet([value]);
  const policy = {
    keys: new Set(),
    get circularMarker() {
      throw new Error("blocked");
    },
  };
  expect(
    serializeDispatch(
      value,
      policy,
      { maxDepth: 2, maxKeys: 2 },
      seen,
      0,
      serializeDispatch,
    ),
  ).toBe("[UNSERIALIZABLE]");
});

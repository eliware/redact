test("exports exactly the declared native ESM public API", async () => {
  const api = await import("../src/index.mjs");

  expect(Object.keys(api).sort()).toEqual([
    "createPolicy",
    "defaultPolicy",
    "redactHeaders",
    "redactText",
    "redactValue",
    "replaceLiteralSecret",
    "safeSerialize",
  ]);
});

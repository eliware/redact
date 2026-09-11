test("loads the native ESM public entrypoint", async () => {
  await import("../src/index.mjs");
});

test("loads the package export entrypoint", async () => {
  const api = await import("@eliware/redact");
  expect(typeof api.redactText).toBe("function");
  expect(typeof api.safeSerialize).toBe("function");
});

test('loads the native ESM public entrypoint', async () => {
  await import('../src/index.mjs');
});

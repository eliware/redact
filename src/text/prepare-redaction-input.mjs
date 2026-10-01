export function prepareRedactionInput(value, maxString) {
  const input = String(value ?? "");
  return { input, inputTruncated: input.length > maxString };
}

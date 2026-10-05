import { serializeBuffer } from "../../src/serialization/serialize-buffer.mjs";

test("represents buffers by length without exposing their contents", () => {
  expect(serializeBuffer(Buffer.from("sensitive"))).toBe("[Buffer length=9]");
});

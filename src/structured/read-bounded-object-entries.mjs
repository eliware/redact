import { readObjectEntries } from "./object-entry-reader.mjs";

export function readBoundedObjectEntries(value, maxEntries) {
  const entries = readObjectEntries(value, maxEntries + 1);
  return {
    entries: entries.slice(0, maxEntries),
    truncated: entries.length > maxEntries,
  };
}

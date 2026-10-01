import { readHeaderArrayEntries } from "./read-header-array-entries.mjs";
import { readHeaderIteratorEntries } from "./read-header-iterator-entries.mjs";
import { readHeaderObjectEntries } from "./read-header-object-entries.mjs";

export function readHeaderEntries(headers) {
  let isArray;
  try {
    isArray = Array.isArray(headers);
  } catch {
    return [];
  }
  if (isArray) return readHeaderArrayEntries(headers);
  try {
    if (headers && typeof headers.entries === "function") return readHeaderIteratorEntries(headers);
  } catch {
    return [];
  }
  return readHeaderObjectEntries(headers);
}

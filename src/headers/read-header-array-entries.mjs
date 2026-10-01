import { isHeaderEntry } from "./is-header-entry.mjs";

export function readHeaderArrayEntries(headers) {
  try {
    return headers.filter(isHeaderEntry);
  } catch {
    return [];
  }
}

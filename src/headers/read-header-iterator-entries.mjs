import { isHeaderEntry } from "./is-header-entry.mjs";

export function readHeaderIteratorEntries(headers) {
  try {
    const entries = [];
    let consumed = 0;
    for (const entry of headers.entries()) {
      consumed += 1;
      if (isHeaderEntry(entry)) entries.push(entry);
      if (consumed === 1000) break;
    }
    return entries;
  } catch {
    return [];
  }
}

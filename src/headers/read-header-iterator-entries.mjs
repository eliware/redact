import { isHeaderEntry } from "./is-header-entry.mjs";

export function readHeaderIteratorEntries(headers) {
  const entries = [];
  try {
    let consumed = 0;
    for (const entry of headers.entries()) {
      consumed += 1;
      if (isHeaderEntry(entry)) entries.push(entry);
      if (consumed === 1000) break;
    }
  } catch {
    // Keep valid entries yielded before the iterator failed.
  }
  return entries;
}

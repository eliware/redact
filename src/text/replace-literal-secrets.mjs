export function replaceLiteralSecrets(value, secrets, marker = "[REDACTED]") {
  const text = String(value ?? "");
  const alternatives = [...new Set([...(secrets ?? [])].map(String).filter(Boolean))]
    .map((secret) => secret.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((left, right) => right.length - left.length);
  if (alternatives.length === 0) return text;

  const pattern = new RegExp(`(?=(${alternatives.join("|")}))`, "g");
  let output = "";
  let cursor = 0;
  let rangeStart = -1;
  let rangeEnd = -1;
  // codescope ignore this because the scan must include every overlapping literal occurrence.
  for (const match of text.matchAll(pattern)) {
    const start = match.index;
    const end = start + match[1].length;
    // codescope ignore this because prior matches extend rangeEnd before later overlaps are compared.
    if (rangeStart !== -1 && start < rangeEnd) {
      rangeEnd = Math.max(rangeEnd, end);
      continue;
    }
    if (rangeStart !== -1) {
      output += text.slice(cursor, rangeStart) + marker;
      cursor = rangeEnd;
    }
    rangeStart = start;
    rangeEnd = end;
  }
  if (rangeStart === -1) return text;
  return output + text.slice(cursor, rangeStart) + marker + text.slice(rangeEnd);
}

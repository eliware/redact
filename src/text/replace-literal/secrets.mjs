export function replaceLiteralSecrets(value, secrets, marker = "[REDACTED]") {
  const text = String(value ?? "");
  const secretValues = typeof secrets === "string" ? [secrets] : [...(secrets ?? [])];
  const alternatives = [...new Set(secretValues.map(String).filter(Boolean))].sort(
    (left, right) => right.length - left.length,
  );
  if (alternatives.length === 0) return text;
  let output = "";
  let cursor = 0;
  let rangeStart = -1;
  let rangeEnd = -1;
  for (let start = 0; start < text.length; start++) {
    const secret = alternatives.find((candidate) => text.startsWith(candidate, start));
    if (!secret) continue;
    const end = start + secret.length;
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

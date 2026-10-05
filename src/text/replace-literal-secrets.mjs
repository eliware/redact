export function replaceLiteralSecrets(value, secrets, marker = "[REDACTED]") {
  const text = String(value ?? "");
  const ranges = [];
  for (const secret of secrets ?? []) {
    const literal = String(secret);
    if (!literal) continue;
    let start = 0;
    while ((start = text.indexOf(literal, start)) !== -1) {
      ranges.push([start, start + literal.length]);
      start++;
    }
  }
  if (ranges.length === 0) return text;
  ranges.sort((left, right) => left[0] - right[0] || right[1] - left[1]);
  let output = "";
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (end <= cursor) continue;
    if (start > cursor) output += text.slice(cursor, start) + marker;
    else if (start === cursor) output += marker;
    cursor = end;
  }
  return output + text.slice(cursor);
}

export function replaceLiteralSecrets(value, secrets, marker = "[REDACTED]") {
  const text = String(value ?? "");
  const secretValues = typeof secrets === "string" ? [secrets] : [...(secrets ?? [])];
  const trie = createSecretTrie(secretValues.map(String).filter(Boolean));
  if (trie.children.size === 0) return text;
  let output = "";
  let cursor = 0;
  let rangeStart = -1;
  let rangeEnd = -1;
  for (let start = 0; start < text.length; start++) {
    const end = findSecretEnd(text, start, trie);
    if (end === -1) continue;
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

function createSecretTrie(secrets) {
  const root = { children: new Map(), terminal: false };
  for (const secret of secrets) {
    let node = root;
    for (let index = 0; index < secret.length; index++) {
      const character = secret[index];
      if (!node.children.has(character))
        node.children.set(character, { children: new Map(), terminal: false });
      node = node.children.get(character);
    }
    node.terminal = true;
  }
  return root;
}

function findSecretEnd(text, start, trie) {
  let node = trie;
  let end = -1;
  for (let index = start; index < text.length; index++) {
    node = node.children.get(text[index]);
    if (!node) break;
    if (node.terminal) end = index + 1;
  }
  return end;
}

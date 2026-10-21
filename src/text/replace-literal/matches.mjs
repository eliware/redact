export function matchSecretRanges(text, secrets) {
  const trie = createSecretTrie(secrets);
  if (trie.children.size === 0) return [];

  const ranges = [];
  let rangeStart = -1;
  let rangeEnd = -1;
  for (let start = 0; start < text.length; start++) {
    const end = findSecretEnd(text, start, trie);
    if (end === -1) continue;
    if (rangeStart !== -1 && start < rangeEnd) {
      rangeEnd = Math.max(rangeEnd, end);
      continue;
    }
    if (rangeStart !== -1) ranges.push([rangeStart, rangeEnd]);
    rangeStart = start;
    rangeEnd = end;
  }
  if (rangeStart !== -1) ranges.push([rangeStart, rangeEnd]);
  return ranges;
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

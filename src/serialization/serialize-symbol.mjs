export function serializeSymbol(value) {
  return `[Symbol: ${value.description ?? ''}]`;
}

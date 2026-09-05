export function serializeFunction(value) {
  return `[Function: ${value.name || 'anonymous'}]`;
}

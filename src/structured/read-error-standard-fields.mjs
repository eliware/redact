export function readErrorStandardFields(value) {
  return {
    name: read(value, "name"),
    message: read(value, "message"),
    stack: read(value, "stack"),
  };
}

function read(value, key) {
  try {
    return value[key];
  } catch {
    return undefined;
  }
}

export function inspectErrorFields(error, entries, keys) {
  const values = new Map(entries);
  const enumerableKeys = new Set(keys);
  const fields = [];

  for (const key of ["name", "message", "stack"]) {
    let value;
    if (enumerableKeys.has(key)) {
      if (!values.has(key)) continue;
      value = values.get(key);
    } else {
      value = error[key];
    }
    if (key === "stack" && !value) continue;
    fields.push([key, value]);
  }

  return fields;
}

export function inspectErrorFields(error, entries, keys, maxKeys = Infinity) {
  const values = new Map(entries);
  const enumerableKeys = new Set(keys);
  const fields = [];
  let retained = entries.length;
  let truncated = false;

  for (const key of ["name", "message", "stack"]) {
    let value;
    if (enumerableKeys.has(key)) {
      if (!values.has(key)) {
        truncated = true;
        continue;
      }
      value = values.get(key);
    } else {
      if (retained >= maxKeys) {
        truncated = true;
        continue;
      }
      value = error[key];
      retained++;
    }
    if (key === "stack" && !value) continue;
    fields.push([key, value]);
  }

  return { fields, truncated };
}

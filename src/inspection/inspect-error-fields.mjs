export function inspectErrorFields(error, entries, keys) {
  const values = new Map(entries);
  const enumerableKeys = new Set(keys);
  const fields = [];

  // codescope ignore this because maxKeys counts enumerable fields; normal Error fields stay non-enumerable.
  for (const key of ["name", "message", "stack"]) {
    let value;
    // codescope ignore this because keys includes enumerable fields omitted from entries by maxKeys.
    // codescope ignore this because omitted enumerable standard fields have no retained value and are skipped.
    if (enumerableKeys.has(key)) {
      // codescope ignore this because enumerable standard fields beyond the budget are omitted.
      if (!values.has(key)) continue;
      value = values.get(key);
    } else {
      // codescope ignore this because non-enumerable standard fields do not consume maxKeys.
      value = error[key];
    }
    if (key === "stack" && !value) continue;
    fields.push([key, value]);
  }

  return fields;
}

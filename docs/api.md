# API Guide

Import public functions from `@eliware/redact`. The package supports native ESM. Internal source files are not public API.

```js
import {
  createPolicy,
  defaultPolicy,
  redactHeaders,
  redactText,
  redactValue,
  replaceLiteralSecret,
  safeSerialize,
} from "@eliware/redact";
```

The package also provides TypeScript declarations in `src/index.d.ts`.

## Policy options

`createPolicy(options)` creates a frozen policy. `defaultPolicy` holds the default key list and marker. Its `keys` value supports `ReadonlySet`. It has no `add`, `delete`, or `clear` methods.

Use these options:

- `keys`: an iterable of sensitive property names.
- `redactKeys`: an alias for `keys`.
- `marker`: replacement text for structured values and configured text rules. The default is `[REDACTED]`.
- `circularMarker`: text for cycles in `redactValue`. The default is `[CIRCULAR]`.

Use `keys` when you want to replace the default list. Use `[...defaultPolicy.keys, "sessionId"]` when you want to add a name.

Pass a policy to any redaction function that accepts policy options:

```js
const policy = createPolicy({
  keys: [...defaultPolicy.keys, "sessionId"],
  marker: "[HIDDEN]",
});
const clean = redactValue({ sessionId: "example-value" }, policy);
```

The output contains `[HIDDEN]` for `sessionId`.

The rules ignore letter case. They keep punctuation and spaces in key names.

The default sensitive names are:

```text
token, accesstoken, authtoken, authorization, cookie, set-cookie,
proxy-authorization, password, passwd, secret, clientsecret, apikey,
api-key, accesskey, privatekey, passphrase, credential, webhook,
signature, tlskey, tlscert
```

## Structured values

`redactValue(value, options)` returns a redacted copy. It does not change the input. It checks property names and does not scan text inside string values.

```js
redactValue({ user: "alex", token: "secret" });
// { user: "alex", token: "[REDACTED]" }
```

For objects, the function reads own string-keyed properties with an enumerable flag. It omits symbol-keyed properties. It preserves an own `__proto__` property as data.

For arrays, the function visits own index values and enumerable non-index properties. It preserves sparse holes and does not read inherited index values. It applies sensitive-key rules to index names such as `0` and to non-index property names. It omits non-sensitive function properties.

For Errors, it reads `name`, `message`, and `stack` fields. It applies sensitive-key rules to these fields and to custom properties.

The function replaces a cycle with `[CIRCULAR]` by default. Set `circularMarker` to change this text.

## Structured limits

Structured redaction supports these options:

| Option     | Default | Effect                           |
| ---------- | ------: | -------------------------------- |
| `maxDepth` |      20 | Limits nested values.            |
| `maxKeys`  |   1,000 | Limits retained property values. |
| `maxArray` |   1,000 | Limits retained array items.     |

The root value starts at depth zero. A child past `maxDepth` becomes `[TRUNCATED]`.

The function floors finite fractional limits. It changes negative limits to zero. It uses the default for a non-finite limit.

`maxKeys` limits retained object property reads. For arrays, it limits index values and non-index property values together. The runtime still lists all own keys to find the retained keys.

If the function omits array items or array properties, it adds `[TRUNCATED]` to the array. If it omits object keys, it adds a `__truncated` property. If that name exists, it uses a free numeric suffix.

If it cannot read a retained object property, the function returns `{}`. If it cannot read a retained array item or property, it returns `[]`.

## HTTP headers

`redactHeaders(headers, options)` accepts a plain object, an array of name-value pairs, or an object with an `entries()` method.

```js
redactHeaders({ Authorization: "Bearer secret", Accept: "application/json" });
// { Authorization: "[REDACTED]", Accept: "application/json" }
```

The function keeps header names from plain objects. It keeps duplicate names in array input. It returns an array for array input.

For `entries()` input, the function returns a lowercase object. It redacts each value before it combines duplicate names. The last value for a name wins.

Header names match without regard to letter case. The function returns `[]` for malformed pairs. It also returns `[]` if it cannot access the entries or read all pairs.

## Text

`redactText(value, options)` converts the input to text, applies built-in rules, then applies configured key names and literal secrets.

Built-in rules cover:

- Authorization values and bearer values.
- Assignments and query values for names such as `api[_-]?key`, `access[_-]?key`, `client[_-]?secret`, `credential`, `password`, `passwd`, `secret`, `token`, and `authorization`.
- Provider tokens that start with `ghp`, `gho`, `ghs`, `github_pat`, `npm_`, or `pypi-`.
- JSON Web Token-like strings with three dot-separated parts and an `eyJ` start.
- Text blocks between `-----BEGIN ...-----` and `-----END ...-----` delimiters.

Use `keys` or `redactKeys` to add names. These names apply to assignment keys and query parameters. The option replaces the default key list for this rule. The built-in rules still apply.

```js
redactText("sessionId=example-value", {
  keys: ["sessionId"],
  marker: "[HIDDEN]",
});
// "sessionId=[HIDDEN]"

redactText("value=example-secret", { secrets: ["example-secret"] });
// "value=[REDACTED]"
```

Use `secrets` to supply literal strings for replacement. The function merges secret matches that share characters. Use `replaceLiteralSecret(value, secret, marker)` to replace one literal secret. Its default marker is `[REDACTED]`.

```js
replaceLiteralSecret("token=example-secret", "example-secret");
// "token=[REDACTED]"
```

Built-in text rules use `[REDACTED]`. The `marker` option applies to configured key names and literal secrets.

The default output limit is 10,000 characters. Set `maxOutputLength` to change it. The function floors finite fractions and changes negative values to zero. It uses the default for non-finite values.

When the function cuts output, it adds `[TRUNCATED]`. If the limit is shorter than that marker, it returns `…`. A zero limit returns an empty string.

## Safe serialization

`safeSerialize(value, options)` returns a bounded representation for logs and diagnostic output. It applies sensitive-key rules and does not change the input.

Serialization options include the policy options and these limits:

| Option      | Default | Effect                                   |
| ----------- | ------: | ---------------------------------------- |
| `maxDepth`  |      20 | Limits nested values.                    |
| `maxKeys`   |   1,000 | Limits retained object property values.  |
| `maxArray`  |   1,000 | Limits retained array items.             |
| `maxString` |  10,000 | Limits text values and primitive labels. |

Use `keys`, `redactKeys`, and `marker` to set policy rules. Safe serialization always uses `[CIRCULAR]` for cycles.

The function floors finite fractional values for `maxDepth`, `maxKeys`, and `maxArray`. It changes negative values to zero. It uses the default for non-finite values.

It preserves sparse array holes and does not read inherited index values. It omits enumerable symbol-keyed object properties. It preserves an own `__proto__` property as data.

The function adds `[TRUNCATED]` when it omits array items. It adds a `__truncated` property when it omits object keys. It uses a free numeric suffix if `__truncated` exists.

Error fields `name`, `message`, and `stack` count against `maxKeys` with custom properties. The function reads each field at most once. A falsy `stack` value does not appear in the result.

The function maps `undefined` to `[Undefined]`. It maps functions to `[Function: name]` and symbols to `[Symbol: description]`. It maps BigInts to text with an `n` suffix. It maps buffers to `[Buffer length=N]`.

The function maps cycles to `[CIRCULAR]`. It cuts long strings and labels, then adds `...[TRUNCATED]`. The `maxString` limit caps the source text. The suffix can make the result longer than that limit.

If it cannot read a retained enumerable own object property, it returns `{}`. Other serialization failures can return `[UNSERIALIZABLE]`.

The function does not prove that output is safe to share. Read [Security and limits](security.md) before you send output to another system.

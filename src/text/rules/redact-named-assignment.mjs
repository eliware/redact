import { SECRET_KEY_PATTERN } from '../patterns/secret-key-patterns.mjs';

export const redactNamedAssignmentRule = [new RegExp(`((?:${SECRET_KEY_PATTERN})\\s*[=:]\\s*)(?:"[^"]*"|'[^']*'|[^\\s,};&]+)`, 'giu'), '$1[REDACTED]'];

import { SECRET_KEY_PATTERN } from '../patterns/secret-key-patterns.mjs';

export const redactQuerySecretRule = [new RegExp(`([?&]${SECRET_KEY_PATTERN}=)[^&#\\s]+`, 'giu'), '$1[REDACTED]'];

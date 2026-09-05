import { redactText, redactValue, safeSerialize } from '@eliware/redact';

console.log(redactText('Authorization: Bearer example-token'));
console.log(redactValue({ token: 'example-token', visible: true }));
console.log(safeSerialize({ password: 'example-password', visible: true }));

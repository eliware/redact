export const redactBearerTokenRule = [/(\bBearer\s+)[A-Za-z0-9._~+/=-]+/giu, '$1[REDACTED]'];

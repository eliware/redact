import { createPolicy, defaultPolicy, redactHeaders, redactValue, safeSerialize } from '@eliware/redact';

const policy = createPolicy({
  keys: ['token'],
  matchHeuristics: false,
  headerNames: ['authorization'],
  maxArray: 10,
  maxDepth: 5,
  maxKeys: 10,
});

void defaultPolicy.maxDepth;
void policy.maxDepth;
redactValue({ token: 'secret' }, policy);
redactHeaders({ authorization: 'secret' }, policy);
safeSerialize({ token: 'secret' }, { ...policy, maxString: 20 });

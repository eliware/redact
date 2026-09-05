import { createPolicy, defaultPolicy, redactHeaders, redactValue, safeSerialize } from '../../index.js';

const policy = createPolicy({
  keys: ['token'],
  redactKeys: ['password'],
  matchHeuristics: false,
  headerNames: ['authorization'],
  maxArray: 10,
  maxDepth: 5,
  maxKeys: 10,
});

void defaultPolicy.maxDepth;
void policy.circularMarker;
redactValue({ token: 'secret' }, policy);
redactHeaders({ authorization: 'secret' }, policy);
safeSerialize({ token: 'secret' }, { ...policy, maxString: 20 });

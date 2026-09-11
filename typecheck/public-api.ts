import {
  createPolicy,
  defaultPolicy,
  redactErrorDetails,
  redactErrorMessage,
  redactHeaders,
  redactText,
  redactValue,
  replaceLiteralSecret,
  safeErrorValue,
  safeSerialize,
} from '@eliware/redact';

const policy = createPolicy({
  keys: ['token'],
  matchHeuristics: false,
  headerNames: ['authorization'],
  maxArray: 10,
  maxDepth: 5,
  maxKeys: 10,
});

void defaultPolicy.maxDepth;
void defaultPolicy.maxArray;
void defaultPolicy.maxKeys;
void defaultPolicy.matchHeuristics;
void defaultPolicy.headerNames;
void policy.maxDepth;
redactValue({ token: 'secret' }, policy);
redactHeaders({ authorization: 'secret' }, policy);
safeSerialize({ token: 'secret' }, { ...policy, maxString: 20 });
redactText('token=secret', { secrets: ['secret'], maxString: 20 });
replaceLiteralSecret('secret', 'secret');
redactErrorMessage(new Error('secret'), { secrets: ['secret'] });
redactErrorDetails(new Error('secret'), policy);
safeErrorValue(new Error('secret'), policy);

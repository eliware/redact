import { defaultPolicy } from "./default-policy.mjs";
import { normalizeHeaderNames } from "../headers/header-name-normalizer.mjs";
export function buildNormalizedPolicy(options, keys) {
  return {
    keys,
    marker: defaultPolicy.marker,
    circularMarker: defaultPolicy.circularMarker,
    maxArray: options.maxArray ?? defaultPolicy.maxArray,
    maxDepth: options.maxDepth ?? defaultPolicy.maxDepth,
    maxKeys: options.maxKeys ?? defaultPolicy.maxKeys,
    matchHeuristics: options.matchHeuristics ?? defaultPolicy.matchHeuristics,
    headerNames: normalizeHeaderNames(options.headerNames),
  };
}

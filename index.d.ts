export interface RedactionPolicy {
  keys?: Iterable<string>;
  maxArray?: number;
  maxDepth?: number;
  maxKeys?: number;
  matchHeuristics?: boolean;
  headerNames?: Iterable<string>;
}

export interface SerializationOptions extends RedactionPolicy {
  maxDepth?: number;
  maxKeys?: number;
  maxString?: number;
}

export interface TextRedactionOptions {
  /** An iterable of non-empty literal strings; non-iterable input throws TypeError. */
  secrets?: Iterable<string>;
  maxString?: number;
}

export declare const defaultPolicy: Readonly<{
  keys: ReadonlySet<string>;
  marker: '[REDACTED]';
  circularMarker: '[CIRCULAR]';
  maxArray: number;
  maxDepth: number;
  maxKeys: number;
  matchHeuristics: boolean;
  headerNames: Iterable<string>;
}>;

export declare function createPolicy(options?: RedactionPolicy): Readonly<RedactionPolicy & {
  keys: ReadonlySet<string>;
  maxArray: number;
  maxDepth: number;
  maxKeys: number;
  matchHeuristics: boolean;
  headerNames: Iterable<string>;
}>;

export declare function redactValue<T>(value: T, options?: RedactionPolicy): unknown;
export declare function redactHeaders(headers: unknown, options?: RedactionPolicy): unknown;
export declare function redactText(value: unknown, options?: TextRedactionOptions): string;
export declare function replaceLiteralSecret(value: unknown, secret: unknown): string;
export declare function safeSerialize(value: unknown, options?: SerializationOptions): unknown;
export declare function redactErrorMessage(error: unknown, options?: TextRedactionOptions): string;
export declare function redactErrorDetails(error: unknown, options?: RedactionPolicy): unknown;
export declare function safeErrorValue(error: unknown, options?: RedactionPolicy): { name?: string; message: string; details?: unknown };

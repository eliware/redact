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
  /** Literal secrets to replace in serialized string values; the first 100 non-empty strings count. */
  secrets?: Iterable<string>;
}

export interface TextRedactionOptions {
  /** Iterable literal secrets; the first 100 non-empty strings count, other values are ignored, and the marker is fixed. */
  secrets?: Iterable<string>;
  maxString?: number;
}

export type SafeSerializedValue =
  null | boolean | number | string | SafeSerializedValue[] | { [key: string]: SafeSerializedValue };

export type RedactedValue =
  | null
  | undefined
  | boolean
  | number
  | string
  | bigint
  | symbol
  | Function
  | RedactedValue[]
  | { [key: string]: RedactedValue };

export type RedactedHeaders = { [key: string]: unknown } | Array<[string, unknown]>;

export declare const defaultPolicy: Readonly<{
  keys: ReadonlySet<string>;
  marker: "[REDACTED]";
  circularMarker: "[CIRCULAR]";
  maxArray: number;
  maxDepth: number;
  maxKeys: number;
  matchHeuristics: boolean;
  headerNames: ReadonlyArray<string>;
}>;

export declare function createPolicy(options?: RedactionPolicy): Readonly<
  RedactionPolicy & {
    keys: ReadonlySet<string>;
    /** Fixed runtime marker; not accepted as an option. */
    marker: "[REDACTED]";
    /** Fixed runtime marker; not accepted as an option. */
    circularMarker: "[CIRCULAR]";
    maxArray: number;
    maxDepth: number;
    maxKeys: number;
    matchHeuristics: boolean;
    headerNames: ReadonlySet<string>;
  }
>;

export declare function redactValue<T>(value: T, options?: RedactionPolicy): RedactedValue;
export declare function redactHeaders(headers: unknown, options?: RedactionPolicy): RedactedHeaders;
export declare function redactText(value: unknown, options?: TextRedactionOptions): string;
export declare function replaceLiteralSecret(value: unknown, secret: unknown): string;
export declare function safeSerialize(
  value: unknown,
  options?: SerializationOptions,
): SafeSerializedValue;
export declare function redactErrorMessage(error: unknown, options?: TextRedactionOptions): string;
export declare function redactErrorDetails(error: unknown, options?: RedactionPolicy): unknown;
export declare function safeErrorValue(
  error: unknown,
  options?: RedactionPolicy,
): { name?: string; message: string; details?: unknown };

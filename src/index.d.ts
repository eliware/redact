export interface RedactionPolicy {
  keys?: Iterable<string>;
  redactKeys?: Iterable<string>;
  marker?: string;
  circularMarker?: string;
}

export interface SerializationOptions extends RedactionPolicy {
  maxDepth?: number;
  maxKeys?: number;
  maxArray?: number;
  maxString?: number;
}

export interface StructuredRedactionOptions extends RedactionPolicy {
  maxDepth?: number;
  maxKeys?: number;
  maxArray?: number;
}

export declare const defaultPolicy: Readonly<{
  keys: ReadonlySet<string>;
  marker: "[REDACTED]";
}>;

export declare function createPolicy(options?: RedactionPolicy): Readonly<
  RedactionPolicy & {
    keys: ReadonlySet<string>;
    marker: string;
  }
>;

export declare function redactValue<T>(value: T, options?: StructuredRedactionOptions): unknown;
export declare function redactHeaders(
  headers: unknown,
  options?: StructuredRedactionOptions,
): unknown;
export declare function redactText(
  value: unknown,
  options?: RedactionPolicy & { secrets?: Iterable<string> },
): string;
export declare function replaceLiteralSecret(
  value: unknown,
  secret: unknown,
  marker?: string,
): string;
export declare function safeSerialize(value: unknown, options?: SerializationOptions): unknown;

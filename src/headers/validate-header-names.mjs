export function validateHeaderNames(headerNames) {
  if (
    headerNames != null &&
    (typeof headerNames === "string" || typeof headerNames[Symbol.iterator] !== "function")
  )
    throw new TypeError("headerNames must be iterable");
}

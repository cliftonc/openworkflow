export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

/**
 * Serialize a value for a JSON text column, keeping null and undefined as
 * SQL NULL.
 * @param value - Value to serialize
 * @returns JSON string or null
 */
// oxlint-disable-next-line anti-slop/no-unknown-parameters -- JSON.stringify owns the serialization of arbitrary input
export function toJSON(value: unknown): string | null {
  return value === null || value === undefined ? null : JSON.stringify(value);
}

/**
 * Deserialize a JSON text column.
 * @param value - JSON string or null
 * @returns Parsed value
 */
export function fromJSON(value: string | null): JsonValue {
  // safety: JSON.parse returns only JSON values when no reviver is supplied.
  return value === null ? null : (JSON.parse(value) as JsonValue);
}

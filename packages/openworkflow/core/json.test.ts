import { fromJSON, toJSON } from "./json.js";
import { describe, expect, test } from "vitest";

describe("toJSON", () => {
  test("keeps null and undefined as SQL NULL", () => {
    expect(toJSON(null)).toBeNull();
    // oxlint-disable-next-line unicorn/no-useless-undefined -- undefined is stored as NULL too
    expect(toJSON(undefined)).toBeNull();
  });

  test("serializes JSON values", () => {
    expect(toJSON({ a: [1, "b"] })).toBe('{"a":[1,"b"]}');
    expect(toJSON("text")).toBe('"text"');
  });
});

describe("fromJSON", () => {
  test("keeps SQL NULL as null", () => {
    expect(fromJSON(null)).toBeNull();
  });

  test("parses JSON text", () => {
    expect(fromJSON('{"a":[1,"b"]}')).toEqual({ a: [1, "b"] });
    expect(fromJSON("null")).toBeNull();
  });
});

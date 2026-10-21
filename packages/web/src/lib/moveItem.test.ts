import { describe, expect, it } from "vitest";
import { moveItem } from "./moveItem";

describe("moveItem", () => {
  it("moves an item up", () => {
    expect(moveItem(["a", "b", "c"], 2, 1)).toEqual(["a", "c", "b"]);
  });

  it("moves an item down", () => {
    expect(moveItem(["a", "b", "c"], 0, 1)).toEqual(["b", "a", "c"]);
  });

  it("returns a copy when the move is invalid", () => {
    const items = ["a", "b"];

    expect(moveItem(items, 0, -1)).toEqual(items);
    expect(moveItem(items, 1, 2)).toEqual(items);
    expect(moveItem(items, 1, 1)).toEqual(items);
    expect(moveItem(items, 0, -1)).not.toBe(items);
  });
});

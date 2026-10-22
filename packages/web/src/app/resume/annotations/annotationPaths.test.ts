import { describe, expect, it } from "vitest";
import { moveAnnotationsAt, removeAnnotationsAt } from "./annotationPaths";

describe("removeAnnotationsAt", () => {
  it("removes annotations attached to the removed item and its children", () => {
    const annotations = {
      "experience[0]": "first role",
      "experience[0].role": "first role title",
      "experience[0].bulletPoints[1]": "first role bullet",
      "experience[1]": "second role",
    };

    expect(removeAnnotationsAt(annotations, "experience", 0)).toEqual({
      "experience[0]": "second role",
    });
  });

  it("shifts later annotations down without touching nested arrays", () => {
    const annotations = {
      "experience[0].bulletPoints[0]": "keep",
      "experience[2].bulletPoints[1]": "shift down",
      "education[2].degree": "unrelated",
    };

    expect(removeAnnotationsAt(annotations, "experience", 1)).toEqual({
      "experience[0].bulletPoints[0]": "keep",
      "experience[1].bulletPoints[1]": "shift down",
      "education[2].degree": "unrelated",
    });
  });
});

describe("moveAnnotationsAt", () => {
  it("moves item annotations and their children", () => {
    const annotations = {
      "experience[0]": "first",
      "experience[1]": "second",
      "experience[1].bulletPoints[0]": "second bullet",
      "experience[2]": "third",
    };

    expect(moveAnnotationsAt(annotations, "experience", 1, 0)).toEqual({
      "experience[0]": "second",
      "experience[0].bulletPoints[0]": "second bullet",
      "experience[1]": "first",
      "experience[2]": "third",
    });
  });

  it("shifts items between the old and new positions", () => {
    const annotations = {
      "experience[0].role": "first",
      "experience[1].role": "second",
      "experience[2].role": "third",
    };

    expect(moveAnnotationsAt(annotations, "experience", 0, 2)).toEqual({
      "experience[0].role": "second",
      "experience[1].role": "third",
      "experience[2].role": "first",
    });
  });

  it("scopes moves to the selected nested array", () => {
    const annotations = {
      "experience[0].bulletPoints[0]": "first bullet",
      "experience[0].bulletPoints[1]": "second bullet",
      "experience[1].role": "unrelated role",
    };

    expect(
      moveAnnotationsAt(annotations, "experience[0].bulletPoints", 1, 0),
    ).toEqual({
      "experience[0].bulletPoints[0]": "second bullet",
      "experience[0].bulletPoints[1]": "first bullet",
      "experience[1].role": "unrelated role",
    });
  });
});

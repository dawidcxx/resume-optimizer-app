import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTable } from "./DataTable";
import { Fact } from "./Fact";
import { ProgressBar } from "./ProgressBar";
import { Stars } from "./Stars";
import { Stat } from "./Stat";
import { Stats } from "./Stats";

describe("resume variety components", () => {
  it("renders half-star ratings", () => {
    const { container, getByRole } = render(
      <Stars label="React" value="3.5" max="5" size="sm" format="stars" />,
    );

    expect(getByRole("img", { name: "3.5 out of 5" })).toBeTruthy();
    const fills = Array.from(container.querySelectorAll("[data-star-fill]")).map((element) =>
      Number(element.getAttribute("data-star-fill")),
    );
    expect(fills).toEqual([1, 1, 1, 0.5, 0]);
  });

  it("can show the numeric star value", () => {
    const { getByText } = render(
      <Stars label="React" value="3.5" max="5" size="sm" format="stars-value" />,
    );

    expect(getByText("3.5/5")).toBeTruthy();
  });

  it("supports decimal progress values", () => {
    const { getByRole, getByText } = render(<ProgressBar label="React" value="4.5" max="5" />);

    expect(getByText("90%")).toBeTruthy();
    expect(getByRole("progressbar").getAttribute("aria-valuenow")).toBe("4.5");
  });

  it("parses a compact data table", () => {
    const { getAllByRole, getByText } = render(
      <DataTable
        caption="Skills"
        headers="Skill|Years|Level"
        rows="React|6|Expert;TypeScript|5|Advanced"
      />,
    );

    expect(getByText("Skills")).toBeTruthy();
    expect(getAllByRole("columnheader")).toHaveLength(3);
    expect(getAllByRole("row")).toHaveLength(3);
    expect(getByText("TypeScript")).toBeTruthy();
  });

  it("renders stats and facts", () => {
    const { getByText } = render(
      <>
        <Stats>
          <Stat value="6+" label="years" />
          <Stat value="40%" label="growth" />
        </Stats>
        <Fact label="Availability" value="Remote" />
      </>,
    );

    expect(getByText("6+")).toBeTruthy();
    expect(getByText("40%")).toBeTruthy();
    expect(getByText("Availability")).toBeTruthy();
    expect(getByText("Remote")).toBeTruthy();
  });
});
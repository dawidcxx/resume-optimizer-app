import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Column } from "./Column";
import { Columns } from "./Columns";
import { Section } from "./Section";
import { validateResumeMarkup } from "./validateMarkup";

describe("Columns", () => {
  it("groups extra children into the weighted columns", () => {
    const { container } = render(
      <Columns ratio="2:1" gap="md">
        <Section title="Experience" />
        <Section title="Education" />
        <Section title="Skills" />
      </Columns>,
    );

    const columns = container.firstElementChild;
    expect(columns?.children).toHaveLength(2);
    expect(columns?.children[0]?.children).toHaveLength(2);
    expect(columns?.children[1]?.children).toHaveLength(1);
  });

  it("balances four children across two columns", () => {
    const { container } = render(
      <Columns ratio="2:1" gap="md">
        <Section title="Experience" />
        <Section title="Skills" />
        <Section title="Education" />
        <Section title="Projects" />
      </Columns>,
    );

    const columns = container.firstElementChild;
    expect(columns?.children).toHaveLength(2);
    expect(columns?.children[0]?.children).toHaveLength(2);
    expect(columns?.children[1]?.children).toHaveLength(2);
  });

  it("keeps an explicit Column stack intact", () => {
    const { container } = render(
      <Columns ratio="1:1" gap="md">
        <Column>
          <Section title="Experience" />
          <Section title="Education" />
        </Column>
        <Column>
          <Section title="Skills" />
        </Column>
      </Columns>,
    );

    expect(container.querySelectorAll("section")).toHaveLength(3);
  });

  it("accepts Column markup", () => {
    const markup = `<Columns ratio="2:1" gap="md"><Column><Section title="Experience" /></Column><Column><Section title="Skills" /></Column></Columns>`;

    expect(validateResumeMarkup(markup)).toBeNull();
  });
});

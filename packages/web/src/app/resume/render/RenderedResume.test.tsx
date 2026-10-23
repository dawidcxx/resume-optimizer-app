import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RenderedResume } from "./RenderedResume";

describe("RenderedResume", () => {
  it("renders every self-closing component in a block", () => {
    const markup = `<Resume>
<Section title="Languages">
<Stars label="English" value="5" max="5" />
<Stars label="German" value="3" max="5" />
<ProgressBar label="Design systems" value="92" max="100" />
</Section>
</Resume>`;

    const { container } = render(<RenderedResume markup={markup} />);

    expect(container.querySelectorAll('[aria-label*="out of"]')).toHaveLength(2);
    expect(container.querySelector('[role="progressbar"]')).not.toBeNull();
  });

  it("renders content separated by blank lines", () => {
    const markup = `<Resume>

<Header name="Robin Render" />

<Section title="About">
Frontend engineer.
</Section>

</Resume>`;

    const { container } = render(<RenderedResume markup={markup} />);

    expect(container.textContent).toContain("Robin Render");
    expect(container.textContent).toContain("Frontend engineer.");
  });

  it("renders ratings, stats, facts, and compact tables", () => {
    const markup = `<Resume>
<Section title="Highlights">
<Stats>
<Stat value="6+" label="years" />
<Stat value="40%" label="growth" />
</Stats>
<Fact label="Availability" value="Remote" />
<Stars label="React" value="3.5" max="5" format="stars-value" />
<DataTable caption="Skills" headers="Skill|Years" rows="React|6;TypeScript|5" />
</Section>
</Resume>`;

    const { container } = render(<RenderedResume markup={markup} />);

    expect(container.textContent).toContain("6+");
    expect(container.textContent).toContain("Remote");
    expect(container.textContent).toContain("3.5/5");
    expect(container.querySelectorAll("th")).toHaveLength(2);
    expect(container.querySelectorAll("[data-star-fill]")).toHaveLength(5);
  });

  it("renders wrapped bullet lists as separate items", () => {
    const markup = `<Resume>
<Section title="Experience">
<Entry title="Engineer">
Built the design system.
<BulletList>
- Shipped tokens.
- Cut bundle size.
</BulletList>
</Entry>
</Section>
</Resume>`;

    const { container } = render(<RenderedResume markup={markup} />);

    expect(container.querySelectorAll("li")).toHaveLength(2);
  });
});
describe("RenderedResume theme sanitization", () => {
  it("falls back when the body font is not body-safe", () => {
    const markup = '<Resume font="jetbrains-mono"><Header name="Ada" /></Resume>';

    const { container } = render(<RenderedResume markup={markup} />);

    expect(container.textContent).toContain("Ada");
    expect(container.querySelector("article")).not.toBeNull();
  });
});
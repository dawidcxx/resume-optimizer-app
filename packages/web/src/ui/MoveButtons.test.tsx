import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MoveButtons } from "./MoveButtons";

describe("MoveButtons", () => {
  it("moves an item up or down", () => {
    const onMove = vi.fn();
    const { getByRole } = render(
      <MoveButtons index={1} count={3} onMove={onMove} label="skill 2" />,
    );

    fireEvent.click(getByRole("button", { name: "Move skill 2 up" }));
    fireEvent.click(getByRole("button", { name: "Move skill 2 down" }));

    expect(onMove).toHaveBeenNthCalledWith(1, 1, 0);
    expect(onMove).toHaveBeenNthCalledWith(2, 1, 2);
  });

  it("disables controls at the edges", () => {
    const { getByRole, rerender } = render(
      <MoveButtons index={0} count={2} onMove={() => undefined} label="item 1" />,
    );

    expect((getByRole("button", { name: "Move item 1 up" }) as HTMLButtonElement).disabled).toBe(
      true,
    );

    rerender(<MoveButtons index={1} count={2} onMove={() => undefined} label="item 2" />);

    expect((getByRole("button", { name: "Move item 2 down" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });
});
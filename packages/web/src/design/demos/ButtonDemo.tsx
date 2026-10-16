import type { ComponentPropsWithRef } from "react";
import { Button, ButtonGroup, IconButton } from "@/ui";
import { DemoBlock, DemoPage, DemoRow } from "../DemoPage";

function Icon({ path, ...props }: ComponentPropsWithRef<"svg"> & { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
      {...props}
    >
      <path d={path} />
    </svg>
  );
}

const icons = {
  plus: "M12 5v14M5 12h14",
  download: "M12 3v12m0 0 4-4m-4 4-4-4M5 21h14",
  trash: "M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13",
  more: "M12 5.5h.01M12 12h.01M12 18.5h.01",
} as const;

export function ButtonDemo() {
  return (
    <DemoPage
      title="Buttons"
      description="Six variants across three sizes, plus icon buttons and grouped buttons. Every button defaults to type=button so it is safe inside forms."
    >
      <DemoBlock title="Variants">
        <DemoRow>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
        </DemoRow>
      </DemoBlock>

      <DemoBlock title="Sizes">
        <DemoRow>
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </DemoRow>
      </DemoBlock>

      <DemoBlock title="With icons">
        <DemoRow>
          <Button variant="primary">
            <Icon path={icons.plus} className="h-3.5 w-3.5" />
            New
          </Button>
          <Button variant="outline">
            <Icon path={icons.download} className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="danger" size="sm">
            <Icon path={icons.trash} className="h-3.5 w-3.5" />
            Delete
          </Button>
        </DemoRow>
      </DemoBlock>

      <DemoBlock title="States">
        <DemoRow>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </DemoRow>
      </DemoBlock>

      <DemoBlock title="Icon buttons">
        <DemoRow>
          <IconButton variant="outline" aria-label="Add">
            <Icon path={icons.plus} />
          </IconButton>
          <IconButton variant="ghost" aria-label="Download">
            <Icon path={icons.download} />
          </IconButton>
          <IconButton variant="danger" aria-label="Delete">
            <Icon path={icons.trash} />
          </IconButton>
          <IconButton variant="ghost" size="sm" aria-label="More">
            <Icon path={icons.more} className="h-3.5 w-3.5" />
          </IconButton>
        </DemoRow>
      </DemoBlock>

      <DemoBlock title="Groups">
        <DemoRow>
          <ButtonGroup>
            <Button variant="outline" size="sm">
              Day
            </Button>
            <Button variant="outline" size="sm">
              Week
            </Button>
            <Button variant="outline" size="sm">
              Month
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="primary" size="sm">
              Save
            </Button>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </ButtonGroup>
        </DemoRow>
      </DemoBlock>
    </DemoPage>
  );
}
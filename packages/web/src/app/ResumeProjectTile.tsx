import type { ResumeProject } from "@resume-optimzer-app/common";
import { format } from "date-fns";
import { cn } from "@/lib/cn";
import { Menu, MenuContent, MenuItem, MenuTrigger, Text } from "@/ui";

export type ResumeProjectTileProps = {
  project: ResumeProject;
  onOpen?: (project: ResumeProject) => void;
  onDelete?: (project: ResumeProject) => void;
  className?: string;
};

export function ResumeProjectTile({
  project,
  onOpen,
  onDelete,
  className,
}: ResumeProjectTileProps) {
  return (
    <div
      className={cn(
        "group relative w-44 rounded-ui border border-border bg-surface p-2.5 transition-colors hover:border-border-strong",
        className,
      )}
    >
      <button
        type="button"
        aria-label={`Open ${project.name}`}
        onClick={() => onOpen?.(project)}
        className="absolute inset-0 z-0 rounded-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      />

      <div className="pointer-events-none relative">
        <ResumeDocumentIcon />

        <div className="relative mt-2.5">
          <div className="min-w-0">
            <Text className="truncate pe-7 font-medium" title={project.name}>
              {project.name}
            </Text>
            <Text variant="subtle" className="mt-0.5 truncate">
              Created {format(project.createdAt, "PP")}
            </Text>
            <Text variant="subtle" className="truncate">
              Updated {format(project.updatedAt, "PP")}
            </Text>
          </div>

          {onDelete ? (
            <div className="pointer-events-auto absolute right-0 top-0 z-10">
              <Menu>
                <MenuTrigger
                  size="sm"
                  variant="ghost"
                  aria-label={`Actions for ${project.name}`}
                  title="Resume actions"
                  className="text-foreground/70 hover:text-foreground"
                >
                  <MoreVerticalIcon />
                </MenuTrigger>
                <MenuContent side="top">
                  <MenuItem destructive onSelect={() => onDelete(project)}>
                    Remove resume
                  </MenuItem>
                </MenuContent>
              </Menu>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ResumeDocumentIcon({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-[3/4] w-full overflow-hidden rounded-[3px] border border-border bg-background shadow-sm",
        "transition-shadow group-hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border bg-subtle px-3 py-2">
        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
        <span className="h-1.5 w-10 rounded-full bg-border-strong" />
      </div>
      <div className="space-y-1.5 p-3">
        <div className="h-1.5 w-3/5 rounded-full bg-border-strong" />
        <div className="h-1 w-full rounded-full bg-border" />
        <div className="h-1 w-11/12 rounded-full bg-border" />
        <div className="h-1 w-4/5 rounded-full bg-border" />
        <div className="mt-2 h-1.5 w-2/5 rounded-full bg-border-strong" />
        <div className="h-1 w-full rounded-full bg-border" />
        <div className="h-1 w-3/4 rounded-full bg-border" />
      </div>
    </div>
  );
}

function MoreVerticalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

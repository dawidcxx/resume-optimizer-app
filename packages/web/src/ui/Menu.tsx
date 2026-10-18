import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { IconButton, type IconButtonProps } from "./IconButton";

type MenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext(): MenuContextValue {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("Menu components must be used within <Menu>");
  }
  return context;
}

export type MenuProps = {
  children: ReactNode;
  className?: string;
};

export function Menu({ children, className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div ref={rootRef} className={cn("relative inline-flex", className)}>
        {children}
      </div>
    </MenuContext.Provider>
  );
}

export type MenuTriggerProps = IconButtonProps;

export function MenuTrigger({ onClick, ...props }: MenuTriggerProps) {
  const { open, setOpen } = useMenuContext();

  return (
    <IconButton
      {...props}
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={(event) => {
        onClick?.(event);
        setOpen(!open);
      }}
    />
  );
}

export type MenuContentProps = ComponentPropsWithRef<"div"> & {
  align?: "start" | "end";
  side?: "top" | "bottom";
};

export function MenuContent({
  align = "end",
  side = "bottom",
  className,
  ...props
}: MenuContentProps) {
  const { open } = useMenuContext();
  if (!open) return null;

  return (
    <div
      role="menu"
      className={cn(
        "absolute z-30 min-w-44 rounded-ui border border-border-strong bg-surface p-1 shadow-lg",
        align === "end" ? "right-0" : "left-0",
        side === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5",
        className,
      )}
      {...props}
    />
  );
}

export type MenuItemProps = ComponentPropsWithRef<"button"> & {
  destructive?: boolean;
  onSelect?: () => void;
};

export function MenuItem({
  destructive = false,
  onSelect,
  className,
  onClick,
  ...props
}: MenuItemProps) {
  const { setOpen } = useMenuContext();

  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        "flex w-full items-center rounded-ui px-2 py-1.5 text-left text-sm transition-colors",
        "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
        destructive ? "text-danger" : "text-foreground",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        onSelect?.();
        setOpen(false);
      }}
      {...props}
    />
  );
}

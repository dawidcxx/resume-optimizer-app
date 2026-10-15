import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export type ListProps = ComponentPropsWithRef<"ul"> & {
  ordered?: boolean;
};

export function List({ ordered = false, className, ...props }: ListProps) {
  const Component = (ordered ? "ol" : "ul") as "ul";
  return (
    <Component
      className={cn(
        "my-1 space-y-1 ps-5 text-sm text-foreground marker:text-muted-foreground",
        ordered ? "list-decimal" : "list-disc",
        className,
      )}
      {...props}
    />
  );
}

export function OrderedList(props: Omit<ListProps, "ordered">) {
  return <List ordered {...props} />;
}

export function UnorderedList(props: Omit<ListProps, "ordered">) {
  return <List {...props} />;
}

export function ListItem({ className, ...props }: ComponentPropsWithRef<"li">) {
  return <li className={cn("ps-0.5 leading-relaxed", className)} {...props} />;
}

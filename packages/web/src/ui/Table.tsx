import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export function Table({ className, ...props }: ComponentPropsWithRef<"table">) {
  return (
    <div className="w-full overflow-x-auto rounded-ui border border-border">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentPropsWithRef<"thead">) {
  return <thead className={cn("[&_tr]:border-b [&_tr]:border-border", className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentPropsWithRef<"tbody">) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableFooter({ className, ...props }: ComponentPropsWithRef<"tfoot">) {
  return (
    <tfoot
      className={cn("border-t border-border bg-subtle font-medium [&>tr]:last:border-0", className)}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: ComponentPropsWithRef<"tr">) {
  return (
    <tr
      className={cn(
        "border-b border-border transition-colors hover:bg-muted/40 data-[state=selected]:bg-accent",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ComponentPropsWithRef<"th">) {
  return (
    <th
      className={cn(
        "h-8 bg-subtle px-3 text-left align-middle text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentPropsWithRef<"td">) {
  return <td className={cn("px-3 py-1.5 align-middle text-foreground", className)} {...props} />;
}

export function TableCaption({ className, ...props }: ComponentPropsWithRef<"caption">) {
  return <caption className={cn("mt-2 text-xs text-muted-foreground", className)} {...props} />;
}
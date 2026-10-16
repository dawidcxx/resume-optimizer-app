import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";
import { buttonBase, buttonVariants, type ButtonVariant } from "./Button";

export const iconButtonSizes = {
  sm: "h-7 w-7",
  md: "h-8 w-8",
  lg: "h-9 w-9",
} as const;

export type IconButtonSize = keyof typeof iconButtonSizes;
export type IconButtonVariant = Exclude<ButtonVariant, "link">;

export type IconButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
};

export function IconButton({
  variant = "ghost",
  size = "md",
  type = "button",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonBase, buttonVariants[variant], "p-0", iconButtonSizes[size], className)}
      {...props}
    />
  );
}
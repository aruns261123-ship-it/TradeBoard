import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        {
          default: "bg-primary/10 text-primary",
          secondary: "bg-secondary text-secondary-foreground",
          outline: "border border-input text-muted-foreground",
          success: "bg-green-100 text-green-800",
          warning: "bg-amber-100 text-amber-800",
          destructive: "bg-red-100 text-red-800",
        }[variant],
        className
      )}
      {...props}
    />
  );
}

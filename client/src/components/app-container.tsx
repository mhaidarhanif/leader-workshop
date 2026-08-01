import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

type AppContainerProps<T extends ElementType = "div"> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function AppContainer<T extends ElementType = "div">({
  as,
  className,
  ...props
}: AppContainerProps<T>) {
  const Component = as ?? "div";

  return (
    <Component className={cn("mx-auto w-full max-w-6xl px-4 sm:px-8", className)} {...props} />
  );
}

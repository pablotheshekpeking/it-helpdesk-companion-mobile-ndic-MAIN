import type { ReactNode } from "react";
import { Pressable, type PressableProps } from "react-native";
import { cn } from "@/lib/utils";
import { Text } from "./text";

type Variant = "default" | "secondary" | "outline" | "ghost" | "destructive";

const variants: Record<Variant, string> = {
  default: "bg-primary",
  secondary: "bg-secondary",
  outline: "border border-border bg-background",
  ghost: "bg-transparent",
  destructive: "bg-destructive",
};

const textVariants: Record<Variant, string> = {
  default: "text-primary-foreground",
  secondary: "text-secondary-foreground",
  outline: "text-foreground",
  ghost: "text-foreground",
  destructive: "text-white",
};

export function Button({
  className,
  variant = "default",
  children,
  disabled,
  ...props
}: PressableProps & { className?: string; variant?: Variant; children: ReactNode }) {
  return (
    <Pressable
      disabled={disabled}
      className={cn(
        "min-h-12 items-center justify-center rounded-lg px-4 py-3.5",
        variants[variant],
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={cn("font-semibold", textVariants[variant])}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

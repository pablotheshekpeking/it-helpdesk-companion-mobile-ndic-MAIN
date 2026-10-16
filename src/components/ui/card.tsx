import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";
import { Text } from "./text";

export function Card({ className, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}
      {...props}
    />
  );
}

export function CardTitle({ children }: { children: string }) {
  return <Text className="text-lg font-semibold">{children}</Text>;
}

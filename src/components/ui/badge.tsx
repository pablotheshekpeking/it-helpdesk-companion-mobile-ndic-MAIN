import { View } from "react-native";
import { cn } from "@/lib/utils";
import { Text } from "./text";

export function Badge({
  children,
  className,
  textClassName,
}: {
  children: string;
  className?: string;
  textClassName?: string;
}) {
  return (
    <View className={cn("self-start rounded-full border border-border bg-secondary px-2.5 py-0.5", className)}>
      <Text className={cn("text-xs font-medium text-secondary-foreground", textClassName)}>{children}</Text>
    </View>
  );
}

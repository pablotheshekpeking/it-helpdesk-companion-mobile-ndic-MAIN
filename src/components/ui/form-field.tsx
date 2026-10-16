import type { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "./text";

export function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <View className="mb-5">
      <Text className="mb-2 text-sm font-medium text-foreground">{label}</Text>
      {hint ? (
        <Text className="mb-2 text-sm leading-5 text-muted-foreground">{hint}</Text>
      ) : null}
      {children}
    </View>
  );
}

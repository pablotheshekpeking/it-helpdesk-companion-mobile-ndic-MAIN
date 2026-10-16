import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Text } from "./text";

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View>
      {children}
      <Pressable accessibilityLabel={label}>
        <Text className="sr-only">{label}</Text>
      </Pressable>
    </View>
  );
}

import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BrandMark } from "@/components/BrandMark";

export function AppHeader({
  subtitle,
  trailing,
}: {
  subtitle: string;
  trailing?: ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-b border-border bg-sidebar"
      style={{ paddingTop: insets.top + 8, paddingBottom: 12, paddingHorizontal: 16 }}
    >
      <View className="flex-row items-center justify-between">
        <BrandMark subtitle={subtitle} />
        {trailing}
      </View>
    </View>
  );
}

import { useState, type ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Text } from "./text";

export function Accordion({
  items,
}: {
  items: { value: string; title: string; content: ReactNode }[];
}) {
  const [open, setOpen] = useState<string | null>(items[0]?.value ?? null);
  return (
    <View className="overflow-hidden rounded-xl border border-border">
      {items.map((item) => {
        const expanded = open === item.value;
        return (
          <View key={item.value} className="border-b border-border last:border-b-0">
            <Pressable
              className="bg-secondary px-4 py-3"
              onPress={() => setOpen(expanded ? null : item.value)}
            >
              <Text className="font-medium">{item.title}</Text>
            </Pressable>
            {expanded ? <View className="bg-card px-4 py-3">{item.content}</View> : null}
          </View>
        );
      })}
    </View>
  );
}

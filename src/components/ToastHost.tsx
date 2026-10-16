import { subscribeToasts, type ToastInput } from "@/lib/toast";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "./ui/text";

export function ToastHost() {
  const [item, setItem] = useState<(ToastInput & { id: number }) | null>(null);

  useEffect(() => subscribeToasts(setItem), []);

  useEffect(() => {
    if (!item) return;
    const timer = setTimeout(() => setItem(null), 4500);
    return () => clearTimeout(timer);
  }, [item]);

  if (!item) return null;

  const tone =
    item.variant === "error"
      ? "border-destructive bg-destructive"
      : item.variant === "success"
        ? "border-primary bg-primary"
        : "border-foreground bg-foreground";

  return (
    <View className="absolute bottom-24 left-4 right-4 z-50">
      <View className={`rounded-lg border px-4 py-3 ${tone}`}>
        <Text className="font-semibold text-white">{item.title}</Text>
        {item.description ? (
          <Text className="mt-1 text-sm text-white/90">{item.description}</Text>
        ) : null}
        {item.action ? (
          <Pressable onPress={item.action.onClick} className="mt-2 self-start">
            <Text className="text-sm font-semibold text-accent">{item.action.label}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

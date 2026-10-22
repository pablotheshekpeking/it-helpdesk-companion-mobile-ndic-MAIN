import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

export function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body?: string;
}) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-secondary">
        <Icon size={26} color="#7434fc" />
      </View>
      <Text className="text-center text-lg font-semibold text-foreground">{title}</Text>
      {body ? (
        <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground">{body}</Text>
      ) : null}
    </View>
  );
}

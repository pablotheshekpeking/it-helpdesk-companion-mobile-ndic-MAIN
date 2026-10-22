import type { ReactNode } from "react";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { Text } from "@/components/ui/text";

export function TopBar({
  title,
  back = false,
  onBack,
  right,
}: {
  title: string;
  back?: boolean;
  onBack?: () => void;
  right?: ReactNode;
}) {
  const router = useRouter();

  return (
    <View className="mb-5 flex-row items-center">
      {back ? (
        <Pressable
          onPress={onBack ?? (() => router.back())}
          hitSlop={8}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-secondary"
        >
          <ArrowLeft size={20} color="#7434fc" />
        </Pressable>
      ) : null}
      <Text className="flex-1 text-2xl font-bold tracking-tight text-foreground" numberOfLines={1}>
        {title}
      </Text>
      {right ? <View className="ml-3">{right}</View> : null}
    </View>
  );
}

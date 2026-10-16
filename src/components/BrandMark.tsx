import { Image } from "expo-image";
import { View } from "react-native";
import { Text } from "./ui/text";

export function BrandMark({ subtitle }: { subtitle: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <Image source={require("../../assets/icon.png")} style={{ width: 32, height: 32, borderRadius: 8 }} />
      <View>
        <Text className="text-sm font-semibold text-primary">ECOWAS</Text>
        <Text className="text-xs text-muted-foreground">{subtitle}</Text>
      </View>
    </View>
  );
}

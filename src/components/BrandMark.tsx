import { Image } from "expo-image";
import { View } from "react-native";
import { Text } from "./ui/text";

export function BrandMark({ subtitle }: { subtitle: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <Image
        source={require("../../assets/ndic-mark.png")}
        style={{ width: 88, height: 32 }}
        contentFit="contain"
      />
      <View>
        <Text className="text-sm font-semibold text-primary">NDIC</Text>
        <Text className="text-xs text-muted-foreground">{subtitle}</Text>
      </View>
    </View>
  );
}

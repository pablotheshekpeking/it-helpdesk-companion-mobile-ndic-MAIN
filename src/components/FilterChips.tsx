import { Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label?: (option: { value: T; label: string }) => string;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingRight: 8 }}
      className="mb-4 grow-0"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable key={option.value} onPress={() => onChange(option.value)}>
            <View
              className={`rounded-full border px-3.5 py-2 ${
                selected ? "border-primary bg-primary" : "border-border bg-secondary"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selected ? "text-primary-foreground" : "text-foreground"
                }`}
              >
                {label ? label(option) : option.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

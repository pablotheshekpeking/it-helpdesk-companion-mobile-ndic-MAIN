import type { ReactNode } from "react";
import { Modal, Pressable, View } from "react-native";
import { Text } from "./text";

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => onOpenChange(false)}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={() => onOpenChange(false)}>
        <Pressable className="max-h-[85%] rounded-t-2xl bg-background p-5" onPress={(e) => e.stopPropagation()}>
          <Text className="mb-4 text-lg font-semibold">{title}</Text>
          <View>{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

import { Modal, Pressable, View } from "react-native";
import { Button } from "./button";
import { Text } from "./text";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Use destructive styling for the confirm action (close, unlink, remove). */
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/45 px-6"
        onPress={onCancel}
      >
        <Pressable
          className="w-full max-w-md rounded-2xl border border-border bg-background p-5"
          onPress={(event) => event.stopPropagation()}
        >
          <Text className="text-lg font-semibold text-foreground">{title}</Text>
          <Text className="mt-2 text-sm leading-5 text-muted-foreground">{description}</Text>
          <View className="mt-5 flex-row gap-2">
            <Button
              variant="outline"
              className="min-h-11 flex-1 py-2.5"
              disabled={loading}
              onPress={onCancel}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={destructive ? "destructive" : "default"}
              className="min-h-11 flex-1 py-2.5"
              disabled={loading}
              onPress={onConfirm}
            >
              {loading ? "Working…" : confirmLabel}
            </Button>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

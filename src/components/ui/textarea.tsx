import { TextInput, type TextInputProps } from "react-native";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextInputProps & { className?: string }) {
  return (
    <TextInput
      multiline
      textAlignVertical="top"
      placeholderTextColor="#525a7a"
      className={cn(
        "min-h-24 rounded-lg border border-input bg-background px-3 py-3 text-base text-foreground",
        className,
      )}
      {...props}
    />
  );
}

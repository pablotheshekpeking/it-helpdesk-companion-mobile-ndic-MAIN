import { cn } from "@/lib/utils";
import { TextInput, type TextInputProps } from "react-native";

export function Input({ className, ...props }: TextInputProps & { className?: string }) {
  return (
    <TextInput
      placeholderTextColor="#525a7a"
      className={cn(
        "min-h-14 rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground",
        className,
      )}
      {...props}
    />
  );
}

import { Text } from "./text";

export function Label({ children }: { children: string }) {
  return <Text className="mb-1 text-sm font-medium text-muted-foreground">{children}</Text>;
}

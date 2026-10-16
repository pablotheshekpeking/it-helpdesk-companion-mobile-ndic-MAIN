import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export function PaginationBar({
  page,
  hasNext,
  onPrev,
  onNext,
}: {
  page: number;
  hasNext?: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (page <= 1 && !hasNext) return null;

  return (
    <View className="mt-4 flex-row items-center justify-between">
      <Button variant="outline" className="min-h-10 flex-1 py-2.5 mr-2" disabled={page <= 1} onPress={onPrev}>
        Previous
      </Button>
      <Text className="mx-2 text-sm text-muted-foreground">Page {page}</Text>
      <Button variant="outline" className="min-h-10 flex-1 py-2.5 ml-2" disabled={!hasNext} onPress={onNext}>
        Next
      </Button>
    </View>
  );
}

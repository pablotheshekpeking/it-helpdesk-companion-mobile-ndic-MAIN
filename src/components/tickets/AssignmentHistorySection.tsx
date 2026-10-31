import { History } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useAssignmentHistory } from "@/hooks/tickets/useAssignmentHistory";
import { formatRelative } from "@/lib/format";

export function AssignmentHistorySection({ ticketId }: { ticketId: string }) {
  const [open, setOpen] = useState(false);
  const history = useAssignmentHistory(ticketId);
  const entries = history.data ?? [];

  return (
    <Card className="mb-5 p-4">
      <Pressable
        onPress={() => setOpen((value) => !value)}
        className="flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-2">
          <History size={16} color="#525a7a" />
          <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Assignment history
          </Text>
        </View>
        <Text className="text-sm font-semibold text-primary">{open ? "Hide" : "Show"}</Text>
      </Pressable>

      {open ? (
        <View className="mt-3 gap-3 border-l-2 border-border pl-3">
          {history.isLoading ? (
            <Text className="text-sm text-muted-foreground">Loading…</Text>
          ) : entries.length === 0 ? (
            <Text className="text-sm text-muted-foreground">No assignment changes yet.</Text>
          ) : (
            entries.map((entry) => (
              <View key={entry.id}>
                <Text className="text-sm font-medium text-foreground">
                  {entry.toTechnicianName ?? "Technician"}
                  {entry.fromTechnicianName
                    ? ` (from ${entry.fromTechnicianName})`
                    : " (initial)"}
                </Text>
                {entry.note ? (
                  <Text className="mt-0.5 text-sm text-muted-foreground">{entry.note}</Text>
                ) : null}
                {entry.createdAt ? (
                  <Text className="mt-0.5 text-xs text-muted-foreground">
                    {formatRelative(entry.createdAt)}
                  </Text>
                ) : null}
              </View>
            ))
          )}
        </View>
      ) : null}
    </Card>
  );
}

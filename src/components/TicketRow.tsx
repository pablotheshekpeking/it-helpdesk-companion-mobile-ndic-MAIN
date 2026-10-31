import { ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { StatusChip } from "@/components/StatusChip";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { formatRelative } from "@/lib/format";
import { lastActivityIso } from "@/lib/ticketDisplay";
import { ticketLabel } from "@/lib/tickets";
import type { Ticket } from "@/types/ticket.types";

export function TicketRow({
  ticket,
  subtitle,
  onPress,
}: {
  ticket: Ticket;
  subtitle?: string;
  onPress: () => void;
}) {
  const when = lastActivityIso(ticket);

  return (
    <Pressable onPress={onPress}>
      <Card className="flex-row items-center p-4">
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {ticketLabel(ticket)}
            </Text>
            <StatusChip status={ticket.status} />
          </View>
          <Text className="mt-2 text-base font-semibold leading-5 text-foreground" numberOfLines={2}>
            {ticket.title}
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground" numberOfLines={1}>
            {[subtitle, when ? formatRelative(when) : null].filter(Boolean).join(" · ")}
          </Text>
        </View>
        <ChevronRight size={18} color="#a3a9c9" />
      </Card>
    </Pressable>
  );
}

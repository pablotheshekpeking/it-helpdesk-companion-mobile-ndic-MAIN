import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { STATUS_META } from "@/lib/ticketDisplay";
import type { TicketStatus } from "@/types/ticket.types";

const TONES: Record<TicketStatus, { wrap: string; text: string; dot: string }> = {
  OPEN: {
    wrap: "bg-slate-100 border-slate-200",
    text: "text-slate-700",
    dot: "bg-slate-500",
  },
  IN_PROGRESS: {
    wrap: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-600",
  },
  WAITING_FOR_EMPLOYEE: {
    wrap: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
    dot: "bg-amber-500",
  },
  RESOLVED: {
    wrap: "bg-teal-50 border-teal-200",
    text: "text-teal-800",
    dot: "bg-teal-600",
  },
  CLOSED: {
    wrap: "bg-muted border-border",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

export function StatusChip({ status }: { status: TicketStatus }) {
  const tone = TONES[status] ?? TONES.OPEN;
  return (
    <View className={cn("flex-row items-center gap-1.5 self-start rounded-full border px-2.5 py-1", tone.wrap)}>
      <View className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
      <Text className={cn("text-xs font-semibold", tone.text)}>{STATUS_META[status].label}</Text>
    </View>
  );
}

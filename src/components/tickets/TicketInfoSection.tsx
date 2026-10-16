import { View } from "react-native";
import { StatusChip } from "@/components/StatusChip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { formatRelative } from "@/lib/format";
import { priorityMeta } from "@/lib/ticketDisplay";
import {
  getAssigneeId,
  getAssigneeName,
  getRequesterName,
  isEmailTicket,
  ticketLabel,
} from "@/lib/tickets";
import type { Ticket } from "@/types/ticket.types";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between gap-3 py-2">
      <Text className="text-sm text-muted-foreground">{label}</Text>
      <Text className="max-w-[60%] text-right text-sm font-medium text-foreground">{value}</Text>
    </View>
  );
}

export function TicketInfoSection({
  ticket,
  showRequester = true,
}: {
  ticket: Ticket;
  showRequester?: boolean;
}) {
  const assignee = getAssigneeName(ticket);
  const awaiting = !getAssigneeId(ticket) && ticket.status === "OPEN";
  const priority = priorityMeta(ticket.priority);

  return (
    <Card className="mb-5 p-4">
      <View className="mb-3 flex-row flex-wrap items-center gap-2">
        <StatusChip status={ticket.status} />
        <Badge className={priority.badgeClass} textClassName="text-xs font-semibold">
          {priority.label}
        </Badge>
        {ticket.category?.name ? (
          <Badge>{ticket.category.name}</Badge>
        ) : null}
        {isEmailTicket(ticket) ? <Badge>Via email</Badge> : null}
      </View>

      <DetailRow label="Ticket" value={ticketLabel(ticket)} />
      {showRequester ? (
        <DetailRow label="Requester" value={getRequesterName(ticket)} />
      ) : null}
      <DetailRow
        label="Assigned to"
        value={assignee || (awaiting ? "Awaiting technician" : "Unassigned")}
      />
      {ticket.createdAt ? (
        <DetailRow label="Opened" value={formatRelative(ticket.createdAt)} />
      ) : null}
      {ticket.updatedAt ? (
        <DetailRow label="Updated" value={formatRelative(ticket.updatedAt)} />
      ) : null}
    </Card>
  );
}

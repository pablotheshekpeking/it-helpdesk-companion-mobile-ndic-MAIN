import { useRouter } from "expo-router";
import { Ticket } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { FilterChips } from "@/components/FilterChips";
import { PaginationBar } from "@/components/PaginationBar";
import { Screen } from "@/components/Screen";
import { TicketRow } from "@/components/TicketRow";
import { TopBar } from "@/components/TopBar";
import { Text } from "@/components/ui/text";
import { usePaginationState } from "@/hooks/common/usePaginationState";
import { useAllTicketList, useTicketList } from "@/hooks/tickets/useTickets";
import { route } from "@/lib/route";
import { ALL_INBOX_VIEWS, viewLabel, type InboxView } from "@/lib/ticketInbox";
import { STATUS_META } from "@/lib/ticketDisplay";
import { getRequesterName } from "@/lib/tickets";
import type { TicketStatus } from "@/types/ticket.types";

const STATUSES: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_EMPLOYEE",
  "RESOLVED",
  "CLOSED",
];

export function TechnicianTicketsPage() {
  const router = useRouter();
  const [view, setView] = useState<InboxView>("all");
  const [status, setStatus] = useState<TicketStatus>("OPEN");
  const paging = usePaginationState({ resetKey: `${view}:${status}` });

  const allList = useAllTicketList({ status }, paging.page, paging.limit, {
    enabled: view === "all",
  });
  const scopedList = useTicketList(
    {
      status,
      assignedTo: view === "unassigned" ? "unassigned" : "me",
    },
    paging.page,
    paging.limit,
    { enabled: view !== "all" },
  );
  const list = view === "all" ? allList : scopedList;

  const title =
    view === "all" ? "All tickets" : view === "mine" ? "My tickets" : "Unassigned";

  return (
    <Screen>
      <TopBar title={title} />
      <FilterChips
        options={ALL_INBOX_VIEWS.map((item) => ({
          value: item,
          label: viewLabel(item),
        }))}
        value={view}
        onChange={setView}
      />
      <FilterChips
        options={STATUSES.map((item) => ({ value: item, label: STATUS_META[item].label }))}
        value={status}
        onChange={setStatus}
      />

      {list.isLoading && list.items.length === 0 ? (
        <Text className="mt-8 text-center text-muted-foreground">Loading tickets…</Text>
      ) : list.items.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="Nothing in this view"
          body={
            view === "all"
              ? "No tickets match this status."
              : view === "mine"
                ? "Tickets assigned to you will show up here."
                : "Unassigned tickets in this status will show up here."
          }
        />
      ) : (
        <View className="gap-3">
          {list.items.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              subtitle={view === "all" || view === "unassigned" ? getRequesterName(ticket) : undefined}
              onPress={() => router.push(route(`/technician/tickets/${ticket.id}`))}
            />
          ))}
        </View>
      )}

      <PaginationBar
        page={paging.page}
        hasNext={list.meta?.hasNext}
        onPrev={() => paging.setPage(paging.page - 1)}
        onNext={() => paging.setPage(paging.page + 1)}
      />
    </Screen>
  );
}

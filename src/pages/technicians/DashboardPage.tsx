import { useRouter } from "expo-router";
import { Inbox, LogOut } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { PaginationBar } from "@/components/PaginationBar";
import { Screen } from "@/components/Screen";
import { TicketRow } from "@/components/TicketRow";
import { Text } from "@/components/ui/text";
import { useLogout } from "@/hooks/auth/useLogout";
import { usePaginationState } from "@/hooks/common/usePaginationState";
import { useAllTicketList } from "@/hooks/tickets/useTickets";
import { route } from "@/lib/route";
import { getRequesterName } from "@/lib/tickets";

export function TechnicianDashboardPage() {
  const router = useRouter();
  const logout = useLogout();
  const paging = usePaginationState({});
  const list = useAllTicketList({}, paging.page, paging.limit);

  return (
    <Screen>
      <View className="mb-5 flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-sm font-medium text-primary">Inbox</Text>
          <Text className="mt-1 text-3xl font-bold tracking-tight">All requests</Text>
          <Text className="mt-1 text-base leading-6 text-muted-foreground">
            Every ticket on the desk. Open one to assign, update, or resolve.
          </Text>
        </View>
        <Pressable
          onPress={() => void logout()}
          accessibilityLabel="Sign out"
          className="h-10 w-10 items-center justify-center rounded-full bg-secondary"
        >
          <LogOut size={18} color="#525a7a" />
        </Pressable>
      </View>

      {list.isLoading && list.items.length === 0 ? (
        <Text className="mt-8 text-center text-muted-foreground">Loading inbox…</Text>
      ) : list.items.length === 0 ? (
        <EmptyState icon={Inbox} title="Inbox is empty" body="New employee requests will land here." />
      ) : (
        <View className="gap-3">
          {list.items.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              subtitle={getRequesterName(ticket)}
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

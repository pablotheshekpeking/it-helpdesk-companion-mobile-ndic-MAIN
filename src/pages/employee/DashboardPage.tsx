import type { ReactNode } from "react";
import { useRouter } from "expo-router";
import { Bell, ChevronRight, LogOut, MonitorSmartphone, Ticket } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useLogout } from "@/hooks/auth/useLogout";
import { useMe } from "@/hooks/auth/useMe";
import { useUnreadNotificationCount } from "@/hooks/notifications/useNotifications";
import { useTicketCounts } from "@/hooks/tickets/useTickets";
import { route } from "@/lib/route";

export function EmployeeDashboardPage() {
  const me = useMe();
  const counts = useTicketCounts();
  const unread = useUnreadNotificationCount();
  const logout = useLogout();
  const router = useRouter();
  const user = me.data;
  const open = counts.data?.statuses.OPEN ?? 0;
  const inProgress = counts.data?.statuses.IN_PROGRESS ?? 0;

  return (
    <Screen>
      <View className="mb-6 flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-sm font-medium text-primary">Dashboard</Text>
          <Text className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Hello{user ? `, ${user.firstName}` : ""}
          </Text>
          <Text className="mt-1 text-base leading-6 text-muted-foreground">
            Track requests and reach IT from this phone.
          </Text>
        </View>
        <Pressable
          onPress={() => void logout()}
          accessibilityLabel="Sign out"
          className="h-10 w-10 items-center justify-center rounded-full bg-secondary"
        >
          <LogOut size={18} color="#4a6356" />
        </Pressable>
      </View>

      <View className="flex-row gap-3">
        <Card className="flex-1 border-0 bg-primary p-4">
          <Text className="text-xs font-medium uppercase tracking-wide text-white/80">Open</Text>
          <Text className="mt-2 text-3xl font-bold text-white">{counts.isLoading ? "—" : open}</Text>
        </Card>
        <Card className="flex-1 bg-accent p-4">
          <Text className="text-xs font-medium uppercase tracking-wide text-accent-foreground/70">
            In progress
          </Text>
          <Text className="mt-2 text-3xl font-bold text-accent-foreground">
            {counts.isLoading ? "—" : inProgress}
          </Text>
        </Card>
      </View>

      <Text className="mb-3 mt-8 text-base font-semibold text-foreground">Shortcuts</Text>
      <View className="gap-3">
        <Shortcut
          icon={<Ticket size={20} color="#006b3f" />}
          title="Tickets"
          body="View, filter, or create a request"
          onPress={() => router.push(route("/employee/tickets"))}
        />
        <Shortcut
          icon={<Bell size={20} color="#006b3f" />}
          title="Alerts"
          body={unread.data ? `${unread.data} unread` : "You're caught up"}
          onPress={() => router.push(route("/employee/notifications"))}
        />
        <Shortcut
          icon={<MonitorSmartphone size={20} color="#006b3f" />}
          title="Devices"
          body="Phones and computers linked to you"
          onPress={() => router.push(route("/employee/device"))}
        />
      </View>
    </Screen>
  );
}

function Shortcut({
  icon,
  title,
  body,
  onPress,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card className="flex-row items-center p-4">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-secondary">{icon}</View>
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold">{title}</Text>
          <Text className="text-sm text-muted-foreground">{body}</Text>
        </View>
        <ChevronRight size={18} color="#a3bdb0" />
      </Card>
    </Pressable>
  );
}

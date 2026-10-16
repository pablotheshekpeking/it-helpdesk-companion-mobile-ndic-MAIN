import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/notifications/useNotifications";
import { formatRelative } from "@/lib/format";
import { route } from "@/lib/route";
import {
  isNotificationRead,
  notificationPath,
  type NotificationItem,
} from "@/types/notification.types";

export function NotificationsPage({ basePath }: { basePath: "/employee" | "/technician" }) {
  const router = useRouter();
  const notifications = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const open = (item: NotificationItem) => {
    markRead.mutate(item.id);
    const path = notificationPath(item, basePath);
    if (path) router.push(route(path.split("?")[0]));
  };

  const hasItems = notifications.items.length > 0;

  return (
    <Screen>
      <TopBar
        title="Alerts"
        right={
          hasItems ? (
            <Pressable onPress={() => markAll.mutate()} hitSlop={8}>
              <Text className="text-sm font-semibold text-primary">Mark all read</Text>
            </Pressable>
          ) : null
        }
      />

      {!hasItems && !notifications.isLoading ? (
        <EmptyState icon={Bell} title="You're caught up" body="New ticket and chat alerts will show here." />
      ) : (
        <View className="gap-3">
          {notifications.items.map((item) => {
            const read = isNotificationRead(item);
            return (
              <Pressable key={item.id} onPress={() => open(item)}>
                <Card className={`p-4 ${read ? "opacity-70" : "border-primary/40"}`}>
                  <View className="flex-row items-start">
                    {!read ? <View className="mr-2 mt-1.5 h-2 w-2 rounded-full bg-primary" /> : null}
                    <View className="flex-1">
                      <Text className="text-base font-semibold">{item.title}</Text>
                      {item.body ? (
                        <Text className="mt-1 text-sm leading-5 text-muted-foreground">{item.body}</Text>
                      ) : null}
                      {item.createdAt ? (
                        <Text className="mt-2 text-xs text-muted-foreground">
                          {formatRelative(item.createdAt)}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

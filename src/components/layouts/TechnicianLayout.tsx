import { AppHeader } from "@/components/AppHeader";
import { useNotificationSocket } from "@/hooks/notifications/useNotificationSocket";
import { useUnreadNotificationCount } from "@/hooks/notifications/useNotifications";
import { useTicketSocket } from "@/hooks/tickets/useTicketSocket";
import { Tabs } from "expo-router";
import {
  Bell,
  CircleDot,
  Home,
  MessageCircle,
  MonitorSmartphone,
  Ticket,
} from "lucide-react-native";
import { View } from "react-native";
// Remote sessions disabled on mobile for now.
// import { useTechnicianSocket } from "@/hooks/useTechnicianSocket";

export function TechnicianLayout() {
  const unread = useUnreadNotificationCount();
  useTicketSocket("/technician");
  useNotificationSocket("/technician");
  // useTechnicianSocket();

  return (
    <View className="flex-1 bg-background">
      <AppHeader subtitle="NDIC Helpdesk · Technician" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2c2f80",
          tabBarInactiveTintColor: "#525a7a",
          tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
          tabBarStyle: {
            backgroundColor: "#f2f4fa",
            borderTopColor: "#d9ddec",
            height: 84,
            paddingTop: 8,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inbox",
            tabBarIcon: ({ color, size }) => <Home color={color} size={size ?? 20} />,
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: "Tickets",
            headerShown: false,
            tabBarIcon: ({ color, size }) => <Ticket color={color} size={size ?? 20} />,
          }}
        />
        <Tabs.Screen
          name="availability"
          options={{
            title: "Status",
            tabBarIcon: ({ color, size }) => <CircleDot color={color} size={size ?? 20} />,
          }}
        />
        <Tabs.Screen
          name="devices"
          options={{
            title: "Devices",
            tabBarIcon: ({ color, size }) => <MonitorSmartphone color={color} size={size ?? 20} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Messages",
            tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size ?? 20} />,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Alerts",
            tabBarBadge: unread.data ? unread.data : undefined,
            tabBarBadgeStyle: { backgroundColor: "#c2410c", fontSize: 10 },
            tabBarIcon: ({ color, size }) => <Bell color={color} size={size ?? 20} />,
          }}
        />
      </Tabs>
    </View>
  );
}

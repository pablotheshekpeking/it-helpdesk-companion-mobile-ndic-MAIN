import { Tabs } from "expo-router";
import { Bell, Home, MessageCircle, MonitorSmartphone, Ticket } from "lucide-react-native";
import { View } from "react-native";
import { AppHeader } from "@/components/AppHeader";
// Remote sessions disabled on mobile for now.
// import { EmployeeRemoteProvider } from "@/components/remote/EmployeeRemoteContext";
// import { SessionRequestBanner } from "@/components/remote/SessionRequestBanner";
import { useNotificationSocket } from "@/hooks/notifications/useNotificationSocket";
import { useUnreadNotificationCount } from "@/hooks/notifications/useNotifications";
import { useTicketSocket } from "@/hooks/tickets/useTicketSocket";

function EmployeeTabs() {
  const unread = useUnreadNotificationCount();
  useTicketSocket("/employee");
  useNotificationSocket("/employee");

  return (
    <View className="flex-1 bg-background">
      <AppHeader subtitle="NDIC Helpdesk" />
      {/* <SessionRequestBanner /> */}
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
            title: "Home",
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
          name="device"
          options={{
            title: "Device",
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

export function EmployeeLayout() {
  // Remote sessions disabled on mobile for now.
  // return (
  //   <EmployeeRemoteProvider>
  //     <EmployeeTabs />
  //   </EmployeeRemoteProvider>
  // );
  return <EmployeeTabs />;
}

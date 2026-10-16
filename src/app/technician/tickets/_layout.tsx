import { Stack } from "expo-router";

export default function TechnicianTicketsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        title: "",
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="[id]" options={{ headerShown: false, title: "" }} />
    </Stack>
  );
}

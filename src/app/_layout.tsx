import "../global.css";
import "react-native-gesture-handler";

import { QueryClientProvider } from "@tanstack/react-query";
import { Slot, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useSyncExternalStore } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initServerStore, getServerSnapshot, subscribeServer } from "@/api/serverStore";
import { restoreSessionOnBoot } from "@/api/session";
import { getTokenSnapshot, registerUnauthorizedHandler, subscribe } from "@/api/tokenStore";
import { initTokenStore } from "@/api/tokenStore";
import { SocketProvider } from "@/components/SocketProvider";
import { ToastHost } from "@/components/ToastHost";
import { useCompanionHeartbeat } from "@/hooks/devices/useCompanionHeartbeat";
import { useMe } from "@/hooks/auth/useMe";
import { queryClient } from "@/lib/queryClient";
import { route } from "@/lib/route";
import { getHomeRouteForRole } from "@/lib/roles";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function useToken() {
  return useSyncExternalStore(subscribe, getTokenSnapshot, getTokenSnapshot);
}

function useServer() {
  return useSyncExternalStore(subscribeServer, getServerSnapshot, getServerSnapshot);
}

function Gate({ ready }: { ready: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const token = useToken();
  const server = useServer();
  const me = useMe();
  useCompanionHeartbeat(!!token);

  useEffect(() => {
    registerUnauthorizedHandler(() => router.replace(route("/login")));
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    if (!server) {
      if (pathname !== "/server-setup") router.replace(route("/server-setup"));
      return;
    }
    if (!token) {
      if (pathname !== "/login" && pathname !== "/server-setup") router.replace(route("/login"));
      return;
    }
    if (!me.data) return;
    const home = getHomeRouteForRole(me.data.role);
    if (pathname === "/" || pathname === "/login" || pathname === "/server-setup") {
      router.replace(route(home));
      return;
    }
    if (me.data.role === "ADMIN" && pathname !== "/unauthorized") {
      router.replace(route("/unauthorized"));
      return;
    }
    if (me.data.role === "EMPLOYEE" && pathname.startsWith("/technician")) {
      router.replace(route("/employee"));
    }
    if (me.data.role === "TECHNICIAN" && pathname.startsWith("/employee")) {
      router.replace(route("/technician"));
    }
  }, [ready, server, token, me.data, pathname, router]);

  return <Slot />;
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      await initServerStore();
      await initTokenStore();
      await restoreSessionOnBoot();
      setReady(true);
      await SplashScreen.hideAsync();
    })();
  }, []);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <Gate ready={ready} />
          <ToastHost />
        </SocketProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

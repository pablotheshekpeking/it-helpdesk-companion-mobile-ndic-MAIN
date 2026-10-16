import { MonitorSmartphone } from "lucide-react-native";
import { View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useMyDevices } from "@/hooks/devices/useMyDevices";
import { useUnlinkDevice } from "@/hooks/devices/useUnlinkDevice";
import { useConfirm } from "@/hooks/useConfirm";
import { toastApiError } from "@/lib/apiError";
import { toast } from "@/lib/toast";

export function DevicesPage({ title }: { title: string }) {
  const devices = useMyDevices();
  const unlink = useUnlinkDevice();
  const { confirm, ConfirmHost } = useConfirm();
  const items = devices.data ?? [];

  return (
    <Screen>
      {ConfirmHost}
      <TopBar title={title} />
      <Text className="mb-5 text-base leading-6 text-muted-foreground">
        This phone is registered when you sign in. Unlink anything you no longer use.
      </Text>

      {items.length === 0 && !devices.isLoading ? (
        <EmptyState icon={MonitorSmartphone} title="No devices" body="Devices linked to your account will appear here." />
      ) : (
        <View className="gap-3">
          {items.map((device) => {
            const online = device.status === "ONLINE";
            return (
              <Card key={device.id} className="p-4">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-base font-semibold">{device.hostname}</Text>
                    <Text className="mt-1 text-sm text-muted-foreground">{device.operatingSystem}</Text>
                  </View>
                  <View
                    className={`rounded-full px-2.5 py-1 ${online ? "bg-primary/10" : "bg-muted"}`}
                  >
                    <Text className={`text-xs font-semibold ${online ? "text-primary" : "text-muted-foreground"}`}>
                      {device.status ?? "UNKNOWN"}
                    </Text>
                  </View>
                </View>
                <Button
                  variant="outline"
                  className="mt-4 min-h-11"
                  disabled={unlink.isPending}
                  onPress={() => {
                    void (async () => {
                      const ok = await confirm({
                        title: "Unlink this device?",
                        description: `Unlink ${device.hostname}? It will need to sign in again to reconnect.`,
                        confirmLabel: "Unlink",
                        destructive: true,
                      });
                      if (!ok) return;
                      unlink.mutate(device.id, {
                        onSuccess: () => toast.success("Device unlinked"),
                        onError: (error) => toastApiError(error),
                      });
                    })();
                  }}
                >
                  Unlink
                </Button>
              </Card>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

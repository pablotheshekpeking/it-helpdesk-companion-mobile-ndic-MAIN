import { getServerSnapshot, setServerUrl } from "@/api/serverStore";
import { BrandMark } from "@/components/BrandMark";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { route } from "@/lib/route";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Switch, View } from "react-native";

export function ServerSetupPage() {
  const router = useRouter();
  const existing = getServerSnapshot();
  const [host, setHost] = useState(existing?.host ?? "");
  const [port, setPort] = useState(existing?.port ? String(existing.port) : "3000");
  const [https, setHttps] = useState(existing?.https ?? false);

  const canContinue = host.trim().length > 0;

  const onContinue = () => {
    const trimmed = host.trim();
    if (!trimmed) return;
    const parsed = Number(port);
    void setServerUrl({
      host: trimmed,
      https,
      port: Number.isInteger(parsed) && parsed > 0 ? parsed : null,
    }).then(() => router.replace(route("/login")));
  };

  return (
    <Screen
      safeTop
      footer={
        <Button disabled={!canContinue} onPress={onContinue}>
          Continue
        </Button>
      }
    >
      <View className="mb-8 mt-2">
        <BrandMark subtitle="IT Support · Companion" />
      </View>

      <View className="mb-6">
        <Text className="text-3xl font-semibold leading-tight text-foreground">
          Connect to IT Help Desk
        </Text>
        <Text className="mt-3 text-base leading-6 text-muted-foreground">
          Use the same server address as the desktop app. Your phone will call that API directly.
        </Text>
      </View>

      <Card className="gap-0 p-0">
        <View className="border-b border-border px-4 py-4">
          <FormField label="Server host" hint="IP address or hostname, without http://">
            <Input
              value={host}
              onChangeText={setHost}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="192.168.1.10"
              returnKeyType="next"
            />
          </FormField>
          <FormField label="Port">
            <Input
              value={port}
              onChangeText={setPort}
              keyboardType="number-pad"
              placeholder="3000"
            />
          </FormField>
        </View>

        <View className="flex-row items-center justify-between px-4 py-4">
          <View className="mr-4 flex-1">
            <Text className="font-medium text-foreground">Use HTTPS</Text>
            <Text className="mt-1 text-sm leading-5 text-muted-foreground">
              Enable for production or TLS-terminated servers.
            </Text>
          </View>
          <Switch
            value={https}
            onValueChange={setHttps}
            trackColor={{ false: "#d5e3db", true: "#006b3f" }}
            thumbColor="#ffffff"
          />
        </View>
      </Card>

      <Text className="mt-6 text-center text-sm leading-5 text-muted-foreground">
        Example: host <Text className="font-medium text-foreground">192.168.1.10</Text> and port{" "}
        <Text className="font-medium text-foreground">3000</Text> for local development.
      </Text>
    </Screen>
  );
}

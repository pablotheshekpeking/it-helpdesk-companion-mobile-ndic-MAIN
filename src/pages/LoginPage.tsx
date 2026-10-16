import { useState, useSyncExternalStore } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { getServerSnapshot, subscribeServer } from "@/api/serverStore";
import { BrandMark } from "@/components/BrandMark";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useLogin } from "@/hooks/auth/useLogin";
import { getLoginErrorMessage } from "@/lib/apiError";
import { route } from "@/lib/route";
import { getHomeRouteForRole } from "@/lib/roles";

export function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const server = useSyncExternalStore(subscribeServer, getServerSnapshot, getServerSnapshot);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canSignIn = email.trim().length > 0 && password.length > 0;
  const serverLabel = server
    ? `${server.host}${server.port ? `:${server.port}` : ""}`
    : null;

  return (
    <Screen
      safeTop
      footer={
        <Button
          disabled={!canSignIn || login.isPending}
          onPress={() => {
            setError(null);
            login.mutate(
              { email: email.trim(), password },
              {
                onSuccess: (data) =>
                  router.replace(route(getHomeRouteForRole(data.user.role))),
                onError: (err) => setError(getLoginErrorMessage(err)),
              },
            );
          }}
        >
          {login.isPending ? "Signing in…" : "Sign in"}
        </Button>
      }
    >
      <View className="mb-8 mt-2">
        <BrandMark subtitle="IT Support · Companion" />
      </View>

      <View className="mb-6">
        <Text className="text-3xl font-semibold leading-tight text-foreground">Sign in</Text>
        <Text className="mt-3 text-base leading-6 text-muted-foreground">
          Employees and technicians use the same account as the desktop app.
        </Text>
      </View>

      <Card>
        <FormField label="Email">
          <Input
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="you@organization.org"
          />
        </FormField>
        <FormField label="Password">
          <Input
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />
        </FormField>
        {error ? (
          <Text className="mb-2 text-sm leading-5 text-destructive">{error}</Text>
        ) : null}
      </Card>

      <View className="mt-5 items-center">
        {serverLabel ? (
          <Text className="mb-2 text-center text-sm text-muted-foreground">
            Server: <Text className="font-medium text-foreground">{serverLabel}</Text>
          </Text>
        ) : null}
        <Pressable
          hitSlop={8}
          onPress={() => router.push(route("/server-setup"))}
          accessibilityRole="button"
          accessibilityLabel="Change server"
        >
          <Text className="text-sm font-semibold text-primary">Change server</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

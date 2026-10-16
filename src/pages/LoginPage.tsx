import { useState, useSyncExternalStore } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { getServerSnapshot, subscribeServer } from "@/api/serverStore";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { BrandMark } from "@/components/BrandMark";
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSignIn = email.trim().length > 0 && password.length > 0;
  const serverLabel = server
    ? `${server.host}${server.port ? `:${server.port}` : ""}`
    : null;

  return (
    <AuthBackground>
      <Card className="border-white/20 bg-white/95">
        <View className="mb-5 items-center">
          <BrandMark subtitle="IT Support · Companion" />
        </View>

        <Text className="text-center text-2xl font-semibold leading-tight text-foreground">
          Sign in
        </Text>
        <Text className="mt-2 mb-5 text-center text-sm leading-5 text-muted-foreground">
          Employees and technicians use the same account as the desktop app.
        </Text>

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
          <View className="relative justify-center">
            <Input
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="••••••••"
              className="pr-12"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
            />
            <Pressable
              hitSlop={8}
              onPress={() => setShowPassword((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 h-10 w-10 items-center justify-center"
            >
              {showPassword ? (
                <EyeOff size={20} color="#4a6356" />
              ) : (
                <Eye size={20} color="#4a6356" />
              )}
            </Pressable>
          </View>
        </FormField>
        {error ? (
          <Text className="mb-3 text-sm leading-5 text-destructive">{error}</Text>
        ) : null}

        <Button
          className="mt-1"
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
      </Card>
    </AuthBackground>
  );
}

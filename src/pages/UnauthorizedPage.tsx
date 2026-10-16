import { Screen } from "@/components/Screen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useLogout } from "@/hooks/auth/useLogout";

export function UnauthorizedPage() {
  const logout = useLogout();
  return (
    <Screen safeTop>
      <Text className="text-2xl font-semibold">Admin accounts use the console</Text>
      <Text className="text-muted-foreground">
        This companion is for employees and technicians. Administrators stay on the admin console.
      </Text>
      <Button onPress={() => void logout()}>Sign out</Button>
    </Screen>
  );
}

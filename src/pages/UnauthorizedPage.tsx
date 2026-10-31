import { AuthBackground } from "@/components/auth/AuthBackground";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useLogout } from "@/hooks/auth/useLogout";
import { View } from "react-native";

export function UnauthorizedPage() {
  const logout = useLogout();
  return (
    <AuthBackground>
      <Card className="border-white/20 bg-white/95">
        <View className="mb-5 items-center">
          <BrandMark subtitle="NDIC Helpdesk · Companion" />
        </View>
        <Text className="text-center text-2xl font-semibold text-foreground">
          Admin accounts use the console
        </Text>
        <Text className="mt-3 mb-6 text-center text-sm leading-5 text-muted-foreground">
          This companion is for employees and technicians. Administrators stay on the admin
          console.
        </Text>
        <Button onPress={() => void logout()}>Sign out</Button>
      </Card>
    </AuthBackground>
  );
}

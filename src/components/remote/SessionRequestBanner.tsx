import { View } from "react-native";
import { useApproveSession } from "@/hooks/remote-sessions/useApproveSession";
import { useDenySession } from "@/hooks/remote-sessions/useDenySession";
import { toastApiError } from "@/lib/apiError";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useEmployeeRemote } from "./EmployeeRemoteContext";

export function SessionRequestBanner() {
  const { request, activeSession, clearRequest, markApproved } = useEmployeeRemote();
  const approve = useApproveSession();
  const deny = useDenySession();

  if (request) {
    return (
      <View className="border-b border-border bg-accent px-4 py-3">
        <Text className="font-semibold">Remote access requested</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          {request.deviceHostname} wants to connect. The session still runs on your work computer.
        </Text>
        <View className="mt-3 flex-row gap-2">
          <Button
            className="flex-1"
            onPress={() => {
              approve.mutate(request.sessionId, {
                onSuccess: () => {
                  markApproved(request);
                  clearRequest();
                  toast.success("Access approved");
                },
                onError: (error) => toastApiError(error),
              });
            }}
          >
            Approve
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onPress={() => {
              deny.mutate(request.sessionId, {
                onSuccess: () => {
                  clearRequest();
                  toast.message("Request declined");
                },
                onError: (error) => toastApiError(error),
              });
            }}
          >
            Decline
          </Button>
        </View>
      </View>
    );
  }

  if (activeSession) {
    return (
      <View className="border-b border-border bg-secondary px-4 py-3">
        <Text className="font-semibold">Remote session {activeSession.status.toLowerCase()}</Text>
        <Text className="text-sm text-muted-foreground">{activeSession.deviceHostname}</Text>
      </View>
    );
  }

  return null;
}

import { Users } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useConfirm } from "@/hooks/useConfirm";
import { useRemoveParticipant } from "@/hooks/tickets/useRemoveParticipant";
import { useTicketParticipants } from "@/hooks/tickets/useTicketParticipants";
import { toastApiError } from "@/lib/apiError";
import { fullName } from "@/lib/format";
import { initials } from "@/lib/ticketDisplay";
import { getParticipantUserId } from "@/lib/tickets";
import { toast } from "@/lib/toast";

export function TicketPeopleSection({
  ticketId,
  currentUserId,
  canRemoveOthers = false,
  onLeft,
}: {
  ticketId: string;
  currentUserId?: string;
  canRemoveOthers?: boolean;
  onLeft?: () => void;
}) {
  const participants = useTicketParticipants(ticketId);
  const remove = useRemoveParticipant();
  const { confirm, ConfirmHost } = useConfirm();
  const items = participants.data ?? [];

  const removeUser = async (userId: string, leaving: boolean, name: string) => {
    const ok = await confirm({
      title: leaving ? "Leave this ticket?" : "Remove participant?",
      description: leaving
        ? "You will no longer receive updates on this ticket."
        : `Remove ${name} from this ticket?`,
      confirmLabel: leaving ? "Leave" : "Remove",
      destructive: true,
    });
    if (!ok) return;

    remove.mutate(
      { id: ticketId, userId },
      {
        onSuccess: () => {
          toast.success(leaving ? "You left the ticket" : "Participant removed");
          if (leaving) onLeft?.();
        },
        onError: (error) => toastApiError(error),
      },
    );
  };

  return (
    <Card className="mb-5 p-4">
      {ConfirmHost}
      <View className="mb-3 flex-row items-center gap-2">
        <Users size={16} color="#5e5675" />
        <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          People
        </Text>
        <Text className="text-xs text-muted-foreground">({items.length})</Text>
      </View>

      {participants.isLoading ? (
        <Text className="text-sm text-muted-foreground">Loading people…</Text>
      ) : items.length === 0 ? (
        <Text className="text-sm text-muted-foreground">No participants yet.</Text>
      ) : (
        <View className="gap-2">
          {items.map((participant) => {
            const userId = getParticipantUserId(participant);
            const isSelf = !!userId && userId === currentUserId;
            const name =
              fullName(participant.user) || participant.user?.email || "Unknown";
            const canLeaveOrRemove = !!userId && (isSelf || canRemoveOthers);

            return (
              <View
                key={userId ?? participant.id}
                className="flex-row items-center gap-3 rounded-xl bg-secondary/70 px-3 py-2.5"
              >
                <View className="h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Text className="text-[10px] font-bold uppercase text-muted-foreground">
                    {initials(name)}
                  </Text>
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="text-sm font-medium" numberOfLines={1}>
                    {name}
                    {isSelf ? " (you)" : ""}
                  </Text>
                  {participant.user?.role ? (
                    <Text className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {participant.user.role}
                    </Text>
                  ) : null}
                </View>
                {canLeaveOrRemove ? (
                  <Pressable
                    hitSlop={8}
                    disabled={remove.isPending}
                    onPress={() => void removeUser(userId!, isSelf, name)}
                  >
                    <Text className="text-sm font-semibold text-destructive">
                      {isSelf ? "Leave" : "Remove"}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
}

import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { AssignmentHistorySection } from "@/components/tickets/AssignmentHistorySection";
import { TicketInfoSection } from "@/components/tickets/TicketInfoSection";
import { TicketPeopleSection } from "@/components/tickets/TicketPeopleSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useMe } from "@/hooks/auth/useMe";
import { useConfirm } from "@/hooks/useConfirm";
import { useAddComment } from "@/hooks/tickets/useAddComment";
import { useCloseTicket } from "@/hooks/tickets/useCloseTicket";
import { useTicket } from "@/hooks/tickets/useTicket";
import { useTicketComments } from "@/hooks/tickets/useTicketComments";
import { toastApiError } from "@/lib/apiError";
import { formatRelative, fullName } from "@/lib/format";
import { route } from "@/lib/route";
import { getCommentAuthor, ticketLabel } from "@/lib/tickets";
import { toast } from "@/lib/toast";

export function EmployeeTicketDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const me = useMe();
  const ticket = useTicket(id);
  const comments = useTicketComments(id);
  const addComment = useAddComment();
  const close = useCloseTicket();
  const { confirm, ConfirmHost } = useConfirm();
  const [message, setMessage] = useState("");
  const data = ticket.data;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(route("/employee/tickets"));
  };

  if (!data) {
    return (
      <Screen>
        <TopBar title="Ticket" back onBack={goBack} />
        <Text className="mt-8 text-center text-muted-foreground">
          {ticket.isLoading ? "Loading ticket…" : "Ticket not found."}
        </Text>
      </Screen>
    );
  }

  const isClosed = data.status === "CLOSED";
  const ownerUserId = data.employee?.user?.id ?? data.employee?.userId;
  const isOwner = !ownerUserId || ownerUserId === me.data?.id;
  const label = ticketLabel(data);

  return (
    <Screen>
      {ConfirmHost}
      <TopBar title={label} back onBack={goBack} />

      <Text className="text-2xl font-bold leading-7 text-foreground">{data.title}</Text>
      <Text className="mt-2 mb-4 text-base leading-6 text-muted-foreground">{data.description}</Text>

      <TicketInfoSection ticket={data} showRequester={!isOwner} />
      <TicketPeopleSection
        ticketId={id}
        currentUserId={me.data?.id}
        onLeft={() => router.replace(route("/employee/tickets"))}
      />
      <AssignmentHistorySection ticketId={id} />

      <Text className="mb-3 text-base font-semibold">Comments</Text>
      <View className="gap-3">
        {comments.data.length === 0 ? (
          <Text className="text-sm text-muted-foreground">No comments yet.</Text>
        ) : (
          comments.data.map((comment) => (
            <View key={comment.id} className="rounded-xl border border-border bg-card p-3">
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="text-xs font-semibold text-muted-foreground">
                  {fullName(getCommentAuthor(comment)) || "Someone"}
                </Text>
                {comment.createdAt ? (
                  <Text className="text-xs text-muted-foreground">
                    {formatRelative(comment.createdAt)}
                  </Text>
                ) : null}
              </View>
              <Text className="text-base leading-5">{comment.message}</Text>
            </View>
          ))
        )}
      </View>

      {!isClosed ? (
        <View className="mt-4">
          <Textarea value={message} onChangeText={setMessage} placeholder="Write a comment" />
          <Button
            className="mt-3"
            disabled={!message.trim() || addComment.isPending}
            onPress={() =>
              addComment.mutate(
                { id, payload: { message: message.trim() } },
                {
                  onSuccess: () => {
                    setMessage("");
                    toast.success("Comment sent");
                  },
                  onError: (error) => toastApiError(error),
                },
              )
            }
          >
            Send comment
          </Button>
        </View>
      ) : (
        <Card className="mt-4 p-4">
          <Text className="text-sm text-muted-foreground">
            This ticket is closed — no further comments can be added.
          </Text>
        </Card>
      )}

      {!isClosed ? (
        <Button
          variant="outline"
          className="mt-6"
          disabled={close.isPending}
          onPress={() => {
            void (async () => {
              const ok = await confirm({
                title: "Close this ticket?",
                description: `Close ${label}? You won't be able to add more comments after this.`,
                confirmLabel: "Close ticket",
                destructive: true,
              });
              if (!ok) return;
              close.mutate(id, {
                onSuccess: () => toast.success("Ticket closed"),
                onError: (error) => toastApiError(error),
              });
            })();
          }}
        >
          Close ticket
        </Button>
      ) : null}
    </Screen>
  );
}

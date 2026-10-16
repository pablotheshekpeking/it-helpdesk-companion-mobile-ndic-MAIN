import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { AssignmentHistorySection } from "@/components/tickets/AssignmentHistorySection";
import { TicketInfoSection } from "@/components/tickets/TicketInfoSection";
import { TicketPeopleSection } from "@/components/tickets/TicketPeopleSection";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useMe } from "@/hooks/auth/useMe";
import { useAllEmployees } from "@/hooks/employees/useEmployees";
// Remote sessions disabled on mobile for now.
// import { useCancelSession } from "@/hooks/remote-sessions/useCancelSession";
// import { useEndSession } from "@/hooks/remote-sessions/useEndSession";
// import { useRequestSession } from "@/hooks/remote-sessions/useRequestSession";
// import { useSaveSessionNotes } from "@/hooks/remote-sessions/useSaveSessionNotes";
import { useAllTechnicians } from "@/hooks/technicians/useTechnicians";
import { useAddComment } from "@/hooks/tickets/useAddComment";
import { useAddParticipant } from "@/hooks/tickets/useAddParticipant";
import { useAssignTicket } from "@/hooks/tickets/useAssignTicket";
import { useCloseTicket } from "@/hooks/tickets/useCloseTicket";
import { useResolveTicket } from "@/hooks/tickets/useResolveTicket";
import { useTicket } from "@/hooks/tickets/useTicket";
import { useTicketComments } from "@/hooks/tickets/useTicketComments";
// import { useTicketDevices } from "@/hooks/tickets/useTicketDevices";
import { useTicketParticipants } from "@/hooks/tickets/useTicketParticipants";
import { useTransferTicket } from "@/hooks/tickets/useTransferTicket";
import { useUpdateTicket } from "@/hooks/tickets/useUpdateTicket";
import { useConfirm } from "@/hooks/useConfirm";
// import { useTechnicianSession } from "@/hooks/useTechnicianSocket";
import { toastApiError } from "@/lib/apiError";
import { formatRelative, fullName } from "@/lib/format";
// import { connectToSession } from "@/lib/remoteConnect";
import { route } from "@/lib/route";
import { STATUS_META } from "@/lib/ticketDisplay";
import {
  getAssigneeId,
  getCommentAuthor,
  getParticipantUserId,
  ticketLabel,
} from "@/lib/tickets";
import { toast } from "@/lib/toast";
import type { TicketStatus } from "@/types/ticket.types";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export function TechnicianTicketDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const ticket = useTicket(id);
  const comments = useTicketComments(id);
  const participants = useTicketParticipants(id);
  // const devices = useTicketDevices(id);
  const technicians = useAllTechnicians();
  const employees = useAllEmployees();
  const me = useMe();
  // const session = useTechnicianSession();
  const [message, setMessage] = useState("");
  // const [notes, setNotes] = useState("");
  const addComment = useAddComment();
  const assign = useAssignTicket();
  const transfer = useTransferTicket();
  const resolve = useResolveTicket();
  const close = useCloseTicket();
  const update = useUpdateTicket();
  const addParticipant = useAddParticipant();
  // const requestSession = useRequestSession();
  // const cancelSession = useCancelSession();
  // const endSession = useEndSession();
  // const saveNotes = useSaveSessionNotes();
  const { confirm, ConfirmHost } = useConfirm();
  const data = ticket.data;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(route("/technician/tickets"));
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

  const myTechnicianId = technicians.data?.find((tech) => tech.userId === me.data?.id)?.id;
  const assigneeId = getAssigneeId(data);
  const assignedToMe = !!assigneeId && !!myTechnicianId && assigneeId === myTechnicianId;
  const unassigned = !assigneeId && data.status === "OPEN";
  const isClosed = data.status === "CLOSED";
  const finished = data.status === "RESOLVED" || isClosed;
  const label = ticketLabel(data);
  const memberIds = new Set(
    (participants.data ?? []).map(getParticipantUserId).filter(Boolean) as string[],
  );

  const setStatus = (status: TicketStatus) =>
    update.mutate({ id, payload: { status } }, { onError: (error) => toastApiError(error) });

  const setPriority = (priority: string) =>
    update.mutate(
      { id, payload: { priority } },
      {
        onSuccess: () => toast.success("Priority updated"),
        onError: (error) => toastApiError(error),
      },
    );

  return (
    <Screen>
      {ConfirmHost}
      <TopBar title={label} back onBack={goBack} />

      <Text className="text-2xl font-bold leading-7">{data.title}</Text>
      <Text className="mt-2 mb-4 text-base leading-6 text-muted-foreground">{data.description}</Text>

      <TicketInfoSection ticket={data} showRequester />
      <TicketPeopleSection
        ticketId={id}
        currentUserId={me.data?.id}
        canRemoveOthers={assignedToMe && !isClosed}
        onLeft={() => router.replace(route("/technician/tickets"))}
      />
      <AssignmentHistorySection ticketId={id} />

      {!isClosed ? (
        <Card className="mb-5 p-4">
          <Text className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Priority
          </Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {PRIORITIES.map((priority) => {
              const selected = data.priority === priority;
              return (
                <Pressable key={priority} onPress={() => setPriority(priority)}>
                  <View
                    className={`rounded-full border px-3 py-1.5 ${
                      selected ? "border-primary bg-primary" : "border-border bg-secondary"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selected ? "text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {priority}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Actions
          </Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {unassigned ? (
              <Button
                className="min-h-11 px-3 py-2"
                onPress={() => {
                  if (!myTechnicianId) {
                    toast.error("Your technician profile was not found");
                    return;
                  }
                  assign.mutate(
                    { id, payload: { technicianId: myTechnicianId } },
                    {
                      onSuccess: () => toast.success("Assigned to you"),
                      onError: (error) => toastApiError(error),
                    },
                  );
                }}
              >
                Assign to me
              </Button>
            ) : null}
            <Button
              variant="outline"
              className="min-h-11 px-3 py-2"
              onPress={() => {
                void (async () => {
                  const ok = await confirm({
                    title: "Resolve this ticket?",
                    description: `Mark ${label} as resolved? The requester will be notified.`,
                    confirmLabel: "Resolve",
                  });
                  if (!ok) return;
                  resolve.mutate(id, {
                    onSuccess: () => toast.success("Ticket resolved"),
                    onError: (e) => toastApiError(e),
                  });
                })();
              }}
            >
              Resolve
            </Button>
            <Button
              variant="outline"
              className="min-h-11 px-3 py-2"
              onPress={() => {
                void (async () => {
                  const ok = await confirm({
                    title: "Close this ticket?",
                    description: `Close ${label}? This ends work on the ticket.`,
                    confirmLabel: "Close ticket",
                    destructive: true,
                  });
                  if (!ok) return;
                  close.mutate(id, {
                    onSuccess: () => toast.success("Ticket closed"),
                    onError: (e) => toastApiError(e),
                  });
                })();
              }}
            >
              Close
            </Button>
          </View>

          <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Status
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {(["OPEN", "IN_PROGRESS", "WAITING_FOR_EMPLOYEE"] as TicketStatus[]).map((status) => {
              const selected = data.status === status;
              return (
                <Pressable key={status} onPress={() => setStatus(status)}>
                  <View
                    className={`rounded-full border px-3 py-1.5 ${
                      selected ? "border-primary bg-primary" : "border-border bg-secondary"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selected ? "text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {STATUS_META[status].label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Card>
      ) : (
        <Card className="mb-5 p-4">
          <Text className="text-sm text-muted-foreground">
            This ticket is closed — no further actions can be taken.
          </Text>
        </Card>
      )}

      {!isClosed ? (
        <Accordion
          items={[
            {
              value: "transfer",
              title: "Transfer",
              content: (
                <View className="gap-2">
                  {(technicians.data ?? [])
                    .filter((tech) => tech.id !== myTechnicianId)
                    .map((tech) => (
                      <Button
                        key={tech.id}
                        variant="outline"
                        className="min-h-11"
                        disabled={!assignedToMe || finished}
                        onPress={() =>
                          transfer.mutate(
                            { id, payload: { technicianId: tech.id } },
                            {
                              onSuccess: () => toast.success("Ticket transferred"),
                              onError: (error) => toastApiError(error),
                            },
                          )
                        }
                      >
                        {fullName(tech.user) || tech.id}
                      </Button>
                    ))}
                </View>
              ),
            },
            {
              value: "add-people",
              title: "Add participants",
              content: (
                <View className="gap-2">
                  {(employees.data ?? [])
                    .filter((employee) => employee.userId && !memberIds.has(employee.userId))
                    .slice(0, 12)
                    .map((employee) => (
                      <Button
                        key={employee.id}
                        variant="outline"
                        className="min-h-11"
                        disabled={!assignedToMe}
                        onPress={() =>
                          addParticipant.mutate(
                            { id, userId: employee.userId! },
                            {
                              onSuccess: () => toast.success("Participant added"),
                              onError: (error) => toastApiError(error),
                            },
                          )
                        }
                      >
                        Add {fullName(employee.user) || employee.user?.email || "employee"}
                      </Button>
                    ))}
                </View>
              ),
            },
            // Remote sessions disabled on mobile for now.
            // {
            //   value: "remote",
            //   title: "Remote session",
            //   content: ( ... ),
            // },
          ]}
        />
      ) : null}

      <Text className="mb-3 mt-6 text-base font-semibold">Comments</Text>
      <View className="gap-3">
        {comments.data.length === 0 ? (
          <Text className="text-sm text-muted-foreground">No comments yet.</Text>
        ) : (
          comments.data.map((comment) => (
            <View key={comment.id} className="rounded-xl border border-border bg-card p-3">
              <View className="mb-1 flex-row justify-between">
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
        <>
          <Textarea className="mt-3" value={message} onChangeText={setMessage} placeholder="Reply" />
          <Button
            className="mt-3"
            disabled={!message.trim()}
            onPress={() =>
              addComment.mutate(
                { id, payload: { message: message.trim(), visibility: "PUBLIC" } },
                {
                  onSuccess: () => setMessage(""),
                  onError: (error) => toastApiError(error),
                },
              )
            }
          >
            Send
          </Button>
        </>
      ) : null}
    </Screen>
  );
}

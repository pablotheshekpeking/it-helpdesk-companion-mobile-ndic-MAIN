import { useRouter } from "expo-router";
import { Plus, Ticket } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { FilterChips } from "@/components/FilterChips";
import { PaginationBar } from "@/components/PaginationBar";
import { Screen } from "@/components/Screen";
import { TicketRow } from "@/components/TicketRow";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/categories/useCategories";
import { usePaginationState } from "@/hooks/common/usePaginationState";
import { useCreateTicket } from "@/hooks/tickets/useCreateTicket";
import { useTicketList } from "@/hooks/tickets/useTickets";
import { toastApiError } from "@/lib/apiError";
import { route } from "@/lib/route";
import { STATUS_META } from "@/lib/ticketDisplay";
import { ticketLabel } from "@/lib/tickets";
import { toast } from "@/lib/toast";
import type { TicketStatus } from "@/types/ticket.types";

const FILTERS: Array<TicketStatus | "ALL"> = [
  "ALL",
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_EMPLOYEE",
  "RESOLVED",
  "CLOSED",
];

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export function EmployeeTicketsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<TicketStatus | "ALL">("ALL");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const categories = useCategories();
  const create = useCreateTicket();
  const paging = usePaginationState({ resetKey: status });
  const list = useTicketList(status === "ALL" ? {} : { status }, paging.page, paging.limit);

  return (
    <Screen>
      <TopBar
        title="Tickets"
        right={
          <Pressable
            onPress={() => setOpen(true)}
            className="h-10 flex-row items-center gap-1 rounded-full bg-primary px-3.5"
          >
            <Plus size={16} color="#ffffff" />
            <Text className="text-sm font-semibold text-primary-foreground">New</Text>
          </Pressable>
        }
      />
      <FilterChips
        options={FILTERS.map((item) => ({
          value: item,
          label: item === "ALL" ? "All" : STATUS_META[item].label,
        }))}
        value={status}
        onChange={setStatus}
      />

      {list.isLoading && list.items.length === 0 ? (
        <Text className="mt-8 text-center text-muted-foreground">Loading tickets…</Text>
      ) : list.items.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No tickets"
          body="Create a request and IT Support will pick it up."
        />
      ) : (
        <View className="gap-3">
          {list.items.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              onPress={() => router.push(route(`/employee/tickets/${ticket.id}`))}
            />
          ))}
        </View>
      )}

      <PaginationBar
        page={paging.page}
        hasNext={list.meta?.hasNext}
        onPrev={() => paging.setPage(paging.page - 1)}
        onNext={() => paging.setPage(paging.page + 1)}
      />

      <Dialog open={open} onOpenChange={setOpen} title="New ticket">
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="gap-4 pb-6">
            <View>
              <Label>Title</Label>
              <Input value={title} onChangeText={setTitle} placeholder="Brief summary of the issue" />
            </View>
            <View>
              <Label>Description</Label>
              <Textarea value={description} onChangeText={setDescription} placeholder="What happened?" />
            </View>
            <View>
              <Label>Priority</Label>
              <View className="flex-row flex-wrap gap-2">
                {PRIORITIES.map((item) => {
                  const selected = priority === item;
                  return (
                    <Pressable key={item} onPress={() => setPriority(item)}>
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
                          {item}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            {(categories.data ?? []).length > 0 ? (
              <View>
                <Label>Category</Label>
                <View className="flex-row flex-wrap gap-2">
                  {(categories.data ?? []).map((category) => {
                    const selected = categoryId === category.id;
                    return (
                      <Pressable key={category.id} onPress={() => setCategoryId(category.id)}>
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
                            {category.name}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}
            <Button
              disabled={create.isPending || !title.trim() || !description.trim()}
              onPress={() =>
                create.mutate(
                  { title: title.trim(), description: description.trim(), priority, categoryId },
                  {
                    onSuccess: (ticket) => {
                      setOpen(false);
                      setTitle("");
                      setDescription("");
                      toast.success("Ticket created", { description: ticketLabel(ticket) });
                      router.push(route(`/employee/tickets/${ticket.id}`));
                    },
                    onError: (error) => toastApiError(error),
                  },
                )
              }
            >
              {create.isPending ? "Submitting…" : "Submit request"}
            </Button>
          </View>
        </ScrollView>
      </Dialog>
    </Screen>
  );
}

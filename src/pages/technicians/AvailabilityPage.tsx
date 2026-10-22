import { CalendarClock, Check, PauseCircle, PlayCircle } from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useCurrentTechnician } from "@/hooks/technicians/useCurrentTechnicianId";
import { useUpdateTechnicianAvailability } from "@/hooks/technicians/useTechnicianAvailability";
import { toastApiError } from "@/lib/apiError";
import { toast } from "@/lib/toast";
import {
  technicianAvailabilityState,
  type TechnicianAvailabilityPayload,
  type TechnicianAvailabilityState,
} from "@/types/technician.types";

function formatUntil(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function stateLabel(state: TechnicianAvailabilityState): string {
  switch (state.kind) {
    case "away":
      return `Away until ${formatUntil(state.until)}`;
    case "paused":
      return "Paused new assignments";
    default:
      return "Available for new assignments";
  }
}

const DOT_COLOR: Record<TechnicianAvailabilityState["kind"], string> = {
  available: "#10b981",
  paused: "#f59e0b",
  away: "#5e5675",
};

function endOfToday(): Date {
  const date = new Date();
  date.setHours(23, 59, 0, 0);
  return date;
}

function addHours(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

function addDays(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(9, 0, 0, 0);
  return date;
}

const AWAY_PRESETS = [
  { label: "2 hours", getUntil: () => addHours(2) },
  { label: "End of day", getUntil: () => endOfToday() },
  { label: "Tomorrow 9am", getUntil: () => addDays(1) },
  { label: "1 week", getUntil: () => addDays(7) },
] as const;

function OptionRow({
  active,
  icon,
  title,
  description,
  onPress,
  disabled,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-start gap-3 rounded-xl border px-3 py-3 ${
        active ? "border-primary/40 bg-primary/5" : "border-border bg-card"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <View className="mt-0.5">{icon}</View>
      <View className="min-w-0 flex-1">
        <Text className="text-base font-medium text-foreground">{title}</Text>
        <Text className="mt-0.5 text-sm leading-5 text-muted-foreground">{description}</Text>
      </View>
      {active ? <Check size={18} color="#7434fc" /> : null}
    </Pressable>
  );
}

export function TechnicianAvailabilityPage() {
  const technician = useCurrentTechnician();
  const update = useUpdateTechnicianAvailability();
  const state = technicianAvailabilityState(technician);
  const [awayFormOpen, setAwayFormOpen] = useState(state.kind === "away");
  const [awayReason, setAwayReason] = useState(
    state.kind === "away" ? (state.reason ?? "") : "",
  );
  const [selectedUntil, setSelectedUntil] = useState<Date | null>(
    state.kind === "away" ? new Date(state.until) : null,
  );

  const save = (payload: TechnicianAvailabilityPayload, message: string) => {
    update.mutate(payload, {
      onSuccess: () => {
        toast.success(message);
        setAwayFormOpen(false);
      },
      onError: (error) => toastApiError(error),
    });
  };

  const setAvailable = () =>
    save(
      { acceptsAssignments: true, excludedUntil: null, excludedReason: null },
      "You're back in the rotation",
    );

  const setPaused = () =>
    save(
      { acceptsAssignments: false, excludedUntil: null, excludedReason: null },
      "New assignments paused",
    );

  const submitAway = () => {
    if (!selectedUntil) {
      toast.error("Pick when you'll be back");
      return;
    }
    if (selectedUntil.getTime() <= Date.now()) {
      toast.error("Pick a time in the future");
      return;
    }
    save(
      {
        acceptsAssignments: true,
        excludedUntil: selectedUntil.toISOString(),
        excludedReason: awayReason.trim() || null,
      },
      `Away until ${formatUntil(selectedUntil.toISOString())}`,
    );
  };

  const label = stateLabel(state);
  const pending = update.isPending;

  return (
    <Screen>
      <TopBar title="Availability" />
      <Text className="mb-1 text-3xl font-bold tracking-tight">Your status</Text>
      <Text className="mb-5 text-base leading-6 text-muted-foreground">
        Controls whether new tickets are auto-assigned to you. Tickets you already hold stay with
        you.
      </Text>

      <View className="mb-5 flex-row items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-3">
        <View
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: DOT_COLOR[state.kind] }}
        />
        <Text className="flex-1 text-sm font-medium text-foreground">{label}</Text>
      </View>

      <View className="gap-2">
        <OptionRow
          active={state.kind === "available" && !awayFormOpen}
          icon={<PlayCircle size={20} color="#5e5675" />}
          title="Available"
          description="Receive new tickets in the rotation"
          onPress={setAvailable}
          disabled={pending}
        />
        <OptionRow
          active={state.kind === "paused" && !awayFormOpen}
          icon={<PauseCircle size={20} color="#5e5675" />}
          title="Pause new assignments"
          description="Stay signed in but skip the rotation"
          onPress={setPaused}
          disabled={pending}
        />
        <OptionRow
          active={state.kind === "away" || awayFormOpen}
          icon={<CalendarClock size={20} color="#5e5675" />}
          title={state.kind === "away" ? label : "Away until…"}
          description={
            state.kind === "away" && state.reason
              ? state.reason
              : "Skip the rotation until a date, e.g. leave"
          }
          onPress={() => setAwayFormOpen(true)}
          disabled={pending}
        />
      </View>

      {awayFormOpen ? (
        <View className="mt-4 gap-3 rounded-xl border border-border bg-muted/40 p-4">
          <Text className="text-sm font-semibold text-foreground">Back on</Text>
          <View className="flex-row flex-wrap gap-2">
            {AWAY_PRESETS.map((preset) => {
              const until = preset.getUntil();
              const selected =
                !!selectedUntil && Math.abs(selectedUntil.getTime() - until.getTime()) < 60_000;
              return (
                <Pressable
                  key={preset.label}
                  onPress={() => setSelectedUntil(until)}
                  className={`rounded-full border px-3 py-2 ${
                    selected ? "border-primary bg-primary" : "border-border bg-background"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selected ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {selectedUntil ? (
            <Text className="text-sm text-muted-foreground">
              Until {formatUntil(selectedUntil.toISOString())}
            </Text>
          ) : null}
          <Text className="text-sm font-semibold text-foreground">Reason (optional)</Text>
          <Input
            value={awayReason}
            onChangeText={setAwayReason}
            placeholder="On leave"
            maxLength={200}
          />
          <View className="mt-1 flex-row gap-2">
            <Button
              variant="outline"
              className="min-h-11 flex-1"
              onPress={() => setAwayFormOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              className="min-h-11 flex-1"
              onPress={submitAway}
              disabled={!selectedUntil || pending}
            >
              {pending ? "Saving…" : "Save"}
            </Button>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

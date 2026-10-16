import { useEffect } from "react";
import { AppState } from "react-native";
import { getStoredDeviceId } from "../../api/deviceStore";
import { deviceService } from "../../services/device.service";

export function useCompanionHeartbeat(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const beat = () => {
      if (AppState.currentState !== "active") return;
      void getStoredDeviceId().then((id) => {
        if (id) void deviceService.heartbeat(id).catch(() => undefined);
      });
    };

    beat();
    const timer = setInterval(beat, 30_000);
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") beat();
    });
    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, [enabled]);
}

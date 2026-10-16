import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { getOrCreateSerialNumber } from "../api/deviceStore";
import type { RegisterDevicePayload } from "../types/device.types";

export async function collectMachineIdentity(): Promise<RegisterDevicePayload> {
  const serialNumber = await getOrCreateSerialNumber();
  const hostname = Device.deviceName || Device.modelName || "Companion phone";
  const operatingSystem = `${Platform.OS} ${Device.osVersion ?? ""}`.trim();
  return {
    fingerprint: serialNumber,
    hostname,
    serialNumber,
    operatingSystem,
    agentVersion: "mobile-0.1.0",
  };
}

export function newIdempotencyKey(): string {
  return Crypto.randomUUID();
}

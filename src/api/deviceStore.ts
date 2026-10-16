import * as Crypto from "expo-crypto";
import { deleteSecure, readSecure, writeSecure } from "./secure";

const SERIAL_KEY = "device_serial";
const DEVICE_ID_KEY = "device_id";

export async function getOrCreateSerialNumber(): Promise<string> {
  const existing = await readSecure(SERIAL_KEY);
  if (existing) return existing;
  const serial = Crypto.randomUUID();
  await writeSecure(SERIAL_KEY, serial);
  return serial;
}

export async function getStoredDeviceId(): Promise<string | null> {
  return readSecure(DEVICE_ID_KEY);
}

export async function setStoredDeviceId(id: string): Promise<void> {
  await writeSecure(DEVICE_ID_KEY, id);
}

export async function clearStoredDeviceId(): Promise<void> {
  await deleteSecure(DEVICE_ID_KEY);
}

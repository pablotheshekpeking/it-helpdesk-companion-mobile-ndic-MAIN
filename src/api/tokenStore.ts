import { deleteSecure, readSecure, writeSecure } from "./secure";

const REFRESH_TOKEN_KEY = "refresh_token";

let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;
let cacheInitialized = false;
const listeners = new Set<() => void>();
let unauthorizedHandler: (() => void) | null = null;

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAccessToken(): string | null {
  return memoryAccessToken;
}

export function getTokenSnapshot(): string | null {
  return memoryAccessToken;
}

export function getRefreshToken(): string | null {
  return memoryRefreshToken;
}

export function registerUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

export function triggerUnauthorizedHandler(): void {
  unauthorizedHandler?.();
}

export async function initTokenStore(): Promise<void> {
  if (cacheInitialized) return;
  memoryRefreshToken = await readSecure(REFRESH_TOKEN_KEY);
  cacheInitialized = true;
  notify();
}

export async function getToken(): Promise<string | null> {
  if (!cacheInitialized) await initTokenStore();
  return memoryAccessToken;
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export async function setSession(tokens: SessionTokens): Promise<void> {
  memoryAccessToken = tokens.accessToken;
  memoryRefreshToken = tokens.refreshToken;
  await writeSecure(REFRESH_TOKEN_KEY, tokens.refreshToken);
  notify();
}

export async function clearSession(): Promise<void> {
  memoryAccessToken = null;
  memoryRefreshToken = null;
  await deleteSecure(REFRESH_TOKEN_KEY);
  notify();
}

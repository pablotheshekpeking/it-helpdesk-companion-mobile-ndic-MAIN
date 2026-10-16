import { deleteSecure, readSecure, writeSecure } from "./secure";

const SERVER_URL_KEY = "server_url";
const SERVER_HTTPS_KEY = "server_https";
const SERVER_PORT_KEY = "server_port";

export interface ServerConfig {
  host: string;
  https: boolean;
  port: number | null;
}

let memoryConfig: ServerConfig | null = null;
let cacheInitialized = false;
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeServer(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getServerSnapshot(): ServerConfig | null {
  return memoryConfig;
}

function parsePort(value: string | null): number | null {
  const port = Number(value);
  return Number.isInteger(port) && port > 0 ? port : null;
}

export async function initServerStore(): Promise<void> {
  if (cacheInitialized) return;
  const host = await readSecure(SERVER_URL_KEY);
  if (host) {
    const https = await readSecure(SERVER_HTTPS_KEY);
    const port = await readSecure(SERVER_PORT_KEY);
    memoryConfig = { host, https: https !== "false", port: parsePort(port) };
  }
  cacheInitialized = true;
  notify();
}

export async function getServerUrl(): Promise<ServerConfig | null> {
  if (!cacheInitialized) await initServerStore();
  return memoryConfig;
}

export async function setServerUrl(config: ServerConfig): Promise<void> {
  memoryConfig = config;
  await writeSecure(SERVER_URL_KEY, config.host);
  await writeSecure(SERVER_HTTPS_KEY, String(config.https));
  if (config.port) {
    await writeSecure(SERVER_PORT_KEY, String(config.port));
  } else {
    await deleteSecure(SERVER_PORT_KEY);
  }
  notify();
}

export async function clearServerUrl(): Promise<void> {
  memoryConfig = null;
  cacheInitialized = false;
  await deleteSecure(SERVER_URL_KEY);
  await deleteSecure(SERVER_HTTPS_KEY);
  await deleteSecure(SERVER_PORT_KEY);
  notify();
}

export function buildBaseUrl(config: ServerConfig): string {
  const protocol = config.https ? "https" : "http";
  const port = config.port ? `:${config.port}` : "";
  return `${protocol}://${config.host}${port}`;
}

export function buildWsUrl(config: ServerConfig): string {
  return `${buildBaseUrl(config)}/ws`;
}

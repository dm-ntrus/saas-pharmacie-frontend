import { io, type Socket } from "socket.io-client";

export type ProvisioningProgressEvent = {
  provisioningId: string;
  step: string;
  progress: number;
  message?: string;
  timestamp?: string;
  stepIndex?: number;
  totalSteps?: number;
};

export type ProvisioningSuccessEvent = {
  provisioningId: string;
  result: unknown;
  timestamp?: string;
};

export type ProvisioningErrorEvent = {
  provisioningId?: string;
  error: string;
  timestamp?: string;
};

/**
 * Socket.IO base URL (without `/api/v1`).
 * - Our REST client uses `${NEXT_PUBLIC_API_URL}/api/v1`
 * - Socket.IO is mounted at server root (`/socket.io`) with namespace `/tenant-provisioning`
 */
export function getSocketIoBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const base = raw.replace(/\/+$/, "");
  return base.endsWith("/api/v1") ? base.slice(0, -"/api/v1".length) : base;
}

export function createTenantProvisioningSocket(): Socket {
  return io(`${getSocketIoBaseUrl()}/tenant-provisioning`, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 12,
    reconnectionDelay: 1_000,
    reconnectionDelayMax: 10_000,
    timeout: 20_000,
  });
}


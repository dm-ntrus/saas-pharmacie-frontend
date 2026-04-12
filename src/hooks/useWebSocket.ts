"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "react-hot-toast";
import { useAppStore } from "@/store/appStore";
import { useAuth } from "@/context/AuthContext";

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface UseSocketIOOptions {
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  enabled?: boolean;
}

function getSocketBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const base = raw.replace(/\/+$/, "");
  return base.endsWith("/api/v1") ? base.slice(0, -"/api/v1".length) : base;
}

export const useSocketIO = (namespace: string, options: UseSocketIOOptions = {}) => {
  const { maxReconnectAttempts = 10, enabled = true } = options;

  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const { addNotification } = useAppStore();
  const { user } = useAuth();

  const handleRealtimeNotification = useCallback(
    (message: WebSocketMessage) => {
      switch (message.type) {
        case "STOCK_ALERT":
          toast(
            `Stock faible: ${message.data.product?.name || "Produit inconnu"}`,
            { duration: 6000 },
          );
          addNotification({
            id: `stock-${message.data.productId}-${Date.now()}`,
            type: "warning",
            title: "Stock faible",
            message: `${message.data.product?.name} - Reste ${message.data.quantity} unité(s)`,
            timestamp: new Date().toISOString(),
            read: false,
          });
          break;

        case "EXPIRY_ALERT":
          toast(
            `Produit bientôt périmé: ${message.data.product?.name}`,
            { duration: 6000 },
          );
          addNotification({
            id: `expiry-${message.data.productId}-${Date.now()}`,
            type: "warning",
            title: "Produit bientôt périmé",
            message: `${message.data.product?.name} expire le ${new Date(message.data.expiryDate).toLocaleDateString("fr-FR")}`,
            timestamp: new Date().toISOString(),
            read: false,
          });
          break;

        case "NEW_PRESCRIPTION":
          toast("Nouvelle prescription reçue", { duration: 4000 });
          addNotification({
            id: `prescription-${message.data.prescriptionId}-${Date.now()}`,
            type: "info",
            title: "Nouvelle prescription",
            message: `Patient: ${message.data.patient?.name} - ${message.data.medicationsCount} médicament(s)`,
            timestamp: new Date().toISOString(),
            read: false,
          });
          break;

        case "PAYMENT_RECEIVED":
          toast.success(`Paiement reçu: ${message.data.amount}€`, {
            duration: 4000,
          });
          break;

        case "USER_LOGIN":
          if (message.data.userId !== user?.id) {
            addNotification({
              id: `login-${message.data.userId}-${Date.now()}`,
              type: "info",
              title: "Utilisateur connecté",
              message: `${message.data.user?.name} s'est connecté`,
              timestamp: new Date().toISOString(),
              read: false,
            });
          }
          break;

        case "SYSTEM_MAINTENANCE":
          toast("Maintenance système planifiée", { duration: 8000 });
          addNotification({
            id: `maintenance-${Date.now()}`,
            type: "info",
            title: "Maintenance système",
            message: message.data.message || "Une maintenance système est planifiée",
            timestamp: new Date().toISOString(),
            read: false,
          });
          break;

        default:
          if (message.data?.showNotification) {
            addNotification({
              id: `generic-${Date.now()}`,
              type: message.data.type || "info",
              title: message.data.title || "Notification",
              message: message.data.message || "Nouvelle notification",
              timestamp: new Date().toISOString(),
              read: false,
            });
          }
          break;
      }
    },
    [addNotification, user?.id],
  );

  const connect = useCallback(() => {
    if (!enabled || !user?.id) return;

    if (socketRef.current?.connected) return;

    const socket = io(`${getSocketBaseUrl()}/${namespace}`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 10_000,
      auth: {
        userId: user.id,
        tenantId: user.tenantId,
      },
    });

    socket.on("connect", () => {
      setConnectionStatus("connected");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socket.on("connect_error", () => {
      setConnectionStatus("error");
    });

    socket.on("notification", (payload: any) => {
      const message: WebSocketMessage = {
        type: payload.type,
        data: payload,
        timestamp: payload.timestamp || new Date().toISOString(),
      };
      setMessages((prev) => [message, ...prev.slice(0, 99)]);
      handleRealtimeNotification(message);
    });

    socket.on("inventory:update", (payload: any) => {
      const message: WebSocketMessage = {
        type: "STOCK_UPDATE",
        data: payload,
        timestamp: payload.timestamp || new Date().toISOString(),
      };
      setMessages((prev) => [message, ...prev.slice(0, 99)]);
    });

    socket.on("sales:update", (payload: any) => {
      const message: WebSocketMessage = {
        type: "SALE_UPDATE",
        data: payload,
        timestamp: payload.timestamp || new Date().toISOString(),
      };
      setMessages((prev) => [message, ...prev.slice(0, 99)]);
    });

    socket.on("alerts:update", (payload: any) => {
      const message: WebSocketMessage = {
        type: payload.data?.type || "STOCK_ALERT",
        data: payload.data || payload,
        timestamp: payload.timestamp || new Date().toISOString(),
      };
      setMessages((prev) => [message, ...prev.slice(0, 99)]);
      handleRealtimeNotification(message);
    });

    socketRef.current = socket;
    setConnectionStatus("connecting");
  }, [enabled, namespace, maxReconnectAttempts, user?.id, user?.tenantId, handleRealtimeNotification]);

  const sendMessage = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  const subscribe = useCallback((channel: string, data?: any) => {
    socketRef.current?.emit(`subscribe:${channel}`, data);
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled && user?.id) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [connect, disconnect, enabled, user?.id]);

  return {
    socket: socketRef.current,
    connectionStatus,
    messages,
    sendMessage,
    subscribe,
    connect,
    disconnect,
    isConnected: connectionStatus === "connected",
  };
};

/** Notifications via Socket.IO — matches backend NotificationGateway at /notifications */
export const useRealtimeNotifications = () => {
  return useSocketIO("notifications", {
    enabled: true,
    maxReconnectAttempts: 10,
  });
};

/** Realtime inventory/sales/alerts via Socket.IO — matches backend RealtimeGateway at /realtime */
export const useRealtimeUpdates = (organizationId?: string) => {
  const result = useSocketIO("realtime", {
    enabled: !!organizationId,
    maxReconnectAttempts: 10,
  });

  useEffect(() => {
    if (result.isConnected && organizationId) {
      result.subscribe("inventory", { table: "inventory", organizationId });
      result.subscribe("sales", { table: "sales", organizationId });
      result.subscribe("alerts", { table: "alerts", organizationId });
    }
  }, [result.isConnected, organizationId, result.subscribe]);

  return result;
};

/** Stock updates — alias for useRealtimeUpdates */
export const useStockUpdates = (organizationId?: string) => {
  return useRealtimeUpdates(organizationId);
};

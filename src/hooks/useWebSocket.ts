import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from '@/store/appStore';
import { apiClient } from '@/lib/apiClient';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  enabled?: boolean;
}

export const useWebSocket = (endpoint: string, options: UseWebSocketOptions = {}) => {
  const {
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
    enabled = true
  } = options;

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  
  const reconnectCount = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const { addNotification } = useAppStore();

  const connect = useCallback(() => {
    if (!enabled) return;

    const token = apiClient.getToken();
    if (!token) return;

    try {
      setConnectionStatus('connecting');
      
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000'}/${endpoint}?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`WebSocket connected to ${endpoint}`);
        setConnectionStatus('connected');
        reconnectCount.current = 0;
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setMessages(prev => [message, ...prev.slice(0, 99)]); // Garder seulement les 100 derniers messages

          // Gestion des notifications en temps réel
          handleRealtimeNotification(message);
        } catch (error) {
          console.error('Erreur parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log(`WebSocket disconnected from ${endpoint}:`, event.code, event.reason);
        setConnectionStatus('disconnected');
        setSocket(null);

        // Tentative de reconnexion automatique
        if (event.code !== 1000 && reconnectCount.current < maxReconnectAttempts) {
          reconnectCount.current++;
          console.log(`Reconnection attempt ${reconnectCount.current}/${maxReconnectAttempts} in ${reconnectInterval}ms`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
    }
  }, [endpoint, enabled, reconnectInterval, maxReconnectAttempts]);

  const handleRealtimeNotification = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'STOCK_ALERT':
        toast.warning(`Stock faible: ${message.data.product?.name || 'Produit inconnu'}`, {
          duration: 6000,
        });
        addNotification({
          id: `stock-${message.data.productId}-${Date.now()}`,
          type: 'warning',
          title: 'Stock faible',
          message: `${message.data.product?.name} - Reste ${message.data.quantity} unité(s)`,
          timestamp: new Date().toISOString(),
          read: false,
        });
        break;

      case 'EXPIRY_ALERT':
        toast.warning(`Produit bientôt périmé: ${message.data.product?.name}`, {
          duration: 6000,
        });
        addNotification({
          id: `expiry-${message.data.productId}-${Date.now()}`,
          type: 'warning',
          title: 'Produit bientôt périmé',
          message: `${message.data.product?.name} expire le ${new Date(message.data.expiryDate).toLocaleDateString('fr-FR')}`,
          timestamp: new Date().toISOString(),
          read: false,
        });
        break;

      case 'NEW_PRESCRIPTION':
        toast.info('Nouvelle prescription reçue', {
          duration: 4000,
        });
        addNotification({
          id: `prescription-${message.data.prescriptionId}-${Date.now()}`,
          type: 'info',
          title: 'Nouvelle prescription',
          message: `Patient: ${message.data.patient?.name} - ${message.data.medicationsCount} médicament(s)`,
          timestamp: new Date().toISOString(),
          read: false,
        });
        break;

      case 'PAYMENT_RECEIVED':
        toast.success(`Paiement reçu: ${message.data.amount}€`, {
          duration: 4000,
        });
        break;

      case 'USER_LOGIN':
        if (message.data.userId !== message.data.currentUserId) {
          addNotification({
            id: `login-${message.data.userId}-${Date.now()}`,
            type: 'info',
            title: 'Utilisateur connecté',
            message: `${message.data.user?.name} s'est connecté`,
            timestamp: new Date().toISOString(),
            read: false,
          });
        }
        break;

      case 'SYSTEM_MAINTENANCE':
        toast.info('Maintenance système planifiée', {
          duration: 8000,
        });
        addNotification({
          id: `maintenance-${Date.now()}`,
          type: 'info',
          title: 'Maintenance système',
          message: message.data.message || 'Une maintenance système est planifiée',
          timestamp: new Date().toISOString(),
          read: false,
        });
        break;

      default:
        // Message générique
        if (message.data.showNotification) {
          addNotification({
            id: `generic-${Date.now()}`,
            type: message.data.type || 'info',
            title: message.data.title || 'Notification',
            message: message.data.message || 'Nouvelle notification',
            timestamp: new Date().toISOString(),
            read: false,
          });
        }
        break;
    }
  };

  const sendMessage = useCallback((data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected. Cannot send message.');
    }
  }, [socket]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (socket) {
      socket.close(1000, 'Manual disconnect');
    }
  }, [socket]);

  // Connexion initiale et nettoyage
  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, enabled]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    socket,
    connectionStatus,
    messages,
    sendMessage,
    connect,
    disconnect,
    isConnected: connectionStatus === 'connected',
  };
};

// Hook spécialisé pour les notifications temps réel
export const useRealtimeNotifications = () => {
  return useWebSocket('notifications', {
    enabled: true,
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
  });
};

// Hook spécialisé pour les mises à jour de stock
export const useStockUpdates = () => {
  return useWebSocket('stock-updates', {
    enabled: true,
    reconnectInterval: 5000,
  });
};

// Hook spécialisé pour les activités utilisateur (admin)
export const useUserActivity = () => {
  return useWebSocket('user-activity', {
    enabled: true,
    reconnectInterval: 10000,
  });
};
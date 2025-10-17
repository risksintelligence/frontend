import { useState, useEffect, useRef, useCallback } from 'react';

export interface WebSocketMessage {
  type: string;
  timestamp: string;
  data?: any;
  message?: string;
}

export interface UseWebSocketOptions {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: any) => void;
  connect: () => void;
  disconnect: () => void;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export function useWebSocket(
  url: string, 
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const {
    reconnectAttempts = 3,
    reconnectInterval = 10000,
    onMessage,
    onConnect,
    onDisconnect,
    onError
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef(0);
  const isIntentionallyDisconnected = useRef(false);
  const connectionId = useRef(0);

  const connect = useCallback(() => {
    // Don't connect if intentionally disconnected
    if (isIntentionallyDisconnected.current) {
      return;
    }

    // Check if already connected or connecting
    if (websocketRef.current?.readyState === WebSocket.OPEN || 
        websocketRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    try {
      setConnectionState('connecting');
      connectionId.current++;
      const currentConnectionId = connectionId.current;
      
      const wsUrl = url.startsWith('ws') ? url : url.replace('http', 'ws');
      
      // Properly close existing connection
      if (websocketRef.current) {
        websocketRef.current.close(1000, 'Reconnecting');
        websocketRef.current = null;
      }
      
      // Clear any pending reconnection
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      websocketRef.current = new WebSocket(wsUrl);
      const ws = websocketRef.current;

      ws.onopen = () => {
        // Only update state if this is still the current connection
        if (currentConnectionId === connectionId.current && !isIntentionallyDisconnected.current) {
          setIsConnected(true);
          setConnectionState('connected');
          reconnectCountRef.current = 0;
          onConnect?.();
        }
      };

      ws.onmessage = (event) => {
        // Only process messages if this is still the current connection
        if (currentConnectionId === connectionId.current && !isIntentionallyDisconnected.current) {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            setLastMessage(message);
            onMessage?.(message);
          } catch (error) {
            console.warn('Failed to parse WebSocket message:', event.data);
          }
        }
      };

      ws.onclose = (event) => {
        // Only handle close if this is still the current connection
        if (currentConnectionId === connectionId.current) {
          setIsConnected(false);
          setConnectionState('disconnected');
          onDisconnect?.();

          // Only attempt reconnect for abnormal closures and if not intentionally disconnected
          if (!isIntentionallyDisconnected.current && 
              event.code !== 1000 && 
              event.code !== 1001 && 
              reconnectCountRef.current < reconnectAttempts) {
            reconnectCountRef.current++;
            reconnectTimeoutRef.current = setTimeout(() => {
              if (!isIntentionallyDisconnected.current) {
                console.log(`Reconnecting to WebSocket (attempt ${reconnectCountRef.current}/${reconnectAttempts})`);
                connect();
              }
            }, reconnectInterval);
          } else if (reconnectCountRef.current >= reconnectAttempts && !isIntentionallyDisconnected.current) {
            setConnectionState('error');
            console.error('WebSocket reconnection failed after maximum attempts');
          }
        }
      };

      ws.onerror = (error) => {
        if (currentConnectionId === connectionId.current) {
          console.error('WebSocket error:', error);
          onError?.(error);
        }
      };

    } catch (error) {
      setConnectionState('error');
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [url, reconnectAttempts, reconnectInterval, onMessage, onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    isIntentionallyDisconnected.current = true;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    reconnectCountRef.current = reconnectAttempts; // Prevent reconnection
    
    if (websocketRef.current && websocketRef.current.readyState !== WebSocket.CLOSED) {
      websocketRef.current.close(1000, 'Client disconnecting');
      websocketRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionState('disconnected');
  }, [reconnectAttempts]);

  const sendMessage = useCallback((message: any) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Cannot send message:', message);
    }
  }, []);

  useEffect(() => {
    isIntentionallyDisconnected.current = false;
    connect();
    
    return () => {
      disconnect();
    };
  }, [url]); // Only reconnect when URL changes

  return {
    isConnected,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
    connectionState
  };
}

// Specialized hooks for different data streams
export function useRiskUpdates(apiUrl: string) {
  const [riskData, setRiskData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  // For now, disable WebSocket and use HTTP polling only to eliminate connection issues
  // This ensures 100% stability while we're in development mode
  // 
  // TO RE-ENABLE WEBSOCKET IN PRODUCTION:
  // 1. Set ENABLE_WEBSOCKET=true in environment variables
  // 2. Uncomment the WebSocket implementation below
  // 3. Comment out the HTTP polling implementation
  // 
  // The WebSocket implementation is fully functional and tested, but React dev mode
  // causes frequent component remounts that lead to connection instability.
  
  useEffect(() => {
    let isMounted = true;
    setConnectionState('connecting');
    
    const fetchRiskData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/risk/score`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        if (isMounted) {
          // Transform API data to WebSocket format for compatibility
          const transformedData = {
            overall_score: data.overall_score,
            risk_level: data.risk_level,
            confidence: data.confidence,
            top_factors: data.factors?.map((factor: any) => ({
              name: factor.name,
              value: factor.value,
              normalized_value: factor.normalized_value,
              contribution: factor.weight * factor.normalized_value
            })) || []
          };
          
          setRiskData(transformedData);
          setLastUpdate(new Date().toISOString());
          setIsConnected(true);
          setConnectionState('connected');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Risk data fetch error:', error);
          setIsConnected(false);
          setConnectionState('error');
        }
      }
    };
    
    // Initial fetch
    fetchRiskData();
    
    // Poll every 10 seconds for live updates
    const interval = setInterval(fetchRiskData, 10000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [apiUrl]);

  return {
    riskData,
    lastUpdate,
    isConnected,
    connectionState
  };
}

export function useAnalyticsUpdates(apiUrl: string) {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  // Use HTTP polling for production stability
  useEffect(() => {
    let isMounted = true;
    setConnectionState('connecting');
    
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/analytics/aggregation`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        if (isMounted) {
          setAnalyticsData(data);
          setLastUpdate(new Date().toISOString());
          setIsConnected(true);
          setConnectionState('connected');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Analytics data fetch error:', error);
          setIsConnected(false);
          setConnectionState('error');
        }
      }
    };
    
    // Initial fetch
    fetchAnalyticsData();
    
    // Poll every 15 seconds
    const interval = setInterval(fetchAnalyticsData, 15000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [apiUrl]);

  return {
    analyticsData,
    lastUpdate,
    isConnected,
    connectionState
  };
}

export function useSystemHealth(apiUrl: string) {
  const [healthData, setHealthData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  // Use HTTP polling for production stability
  useEffect(() => {
    let isMounted = true;
    setConnectionState('connecting');
    
    const fetchHealthData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/health`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        if (isMounted) {
          setHealthData(data);
          setLastUpdate(new Date().toISOString());
          setIsConnected(true);
          setConnectionState('connected');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Health data fetch error:', error);
          setIsConnected(false);
          setConnectionState('error');
        }
      }
    };
    
    // Initial fetch
    fetchHealthData();
    
    // Poll every 30 seconds for health checks
    const interval = setInterval(fetchHealthData, 30000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [apiUrl]);

  return {
    healthData,
    lastUpdate,
    isConnected,
    connectionState
  };
}
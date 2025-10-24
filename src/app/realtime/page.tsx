'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity, Wifi, WifiOff, Users, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
  connection_id?: string;
}

interface ConnectionInfo {
  connection_id: string;
  connected_at: string;
  subscriptions: string[];
  status: 'connected' | 'disconnected' | 'reconnecting';
}

export default function RealTimePage() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error' | 'reconnecting'>('disconnected');
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [activeConnections, setActiveConnections] = useState<number>(0);
  const [messageCount, setMessageCount] = useState<number>(0);
  const [lastMessageTime, setLastMessageTime] = useState<string>('');
  const [availableTopics] = useState<string[]>([
    'risk_updates',
    'economic_data',
    'market_volatility',
    'system_alerts',
    'cache_statistics',
    'model_performance'
  ]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
    setConnectionStatus('connecting');
    
    try {
      // Connect to the actual backend WebSocket endpoint
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/api/v1/ws/stream';
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = (event) => {
        setIsConnected(true);
        setConnectionStatus('connected');
        
        // Send initial message to establish connection
        if (wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'connection_request',
            client_id: `frontend_${Date.now()}`,
            timestamp: new Date().toISOString()
          }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          setMessages(prev => [...prev.slice(-49), message]); // Keep last 50 messages
          setMessageCount(prev => prev + 1);
          setLastMessageTime(new Date().toLocaleTimeString());
          
          // Handle specific message types
          if (message.type === 'connection_established') {
            setConnectionInfo({
              connection_id: message.data.connection_id,
              connected_at: message.data.timestamp,
              subscriptions: [],
              status: 'connected'
            });
          } else if (message.type === 'subscription_confirmed') {
            setSubscriptions(prev => [...prev, message.data.topic]);
          } else if (message.type === 'system_stats') {
            setActiveConnections(message.data.active_connections || 0);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        setConnectionInfo(null);
        
        // Attempt to reconnect after 5 seconds if not manually disconnected
        if (event.code !== 1000) {
          setTimeout(() => {
            if (connectionStatus !== 'disconnected') {
              setConnectionStatus('reconnecting');
              connectWebSocket();
            }
          }, 5000);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setConnectionInfo(null);
    setSubscriptions([]);
  };

  const subscribeToTopic = (topic: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        topic: topic,
        timestamp: new Date().toISOString()
      }));
    }
  };

  const unsubscribeFromTopic = (topic: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'unsubscribe',
        topic: topic,
        timestamp: new Date().toISOString()
      }));
      setSubscriptions(prev => prev.filter(t => t !== topic));
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setMessageCount(0);
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': case 'reconnecting': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'connecting': case 'reconnecting': return <Activity className="w-5 h-5 text-yellow-600 animate-spin" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <WifiOff className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Real-Time Data Streaming</h1>
          <p className="text-[#374151]">Live WebSocket connection to backend data streams and system events</p>
        </div>

        {/* Connection Status */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Connection Status</h3>
                <p className={`text-sm font-medium ${getStatusColor()}`}>
                  {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                </p>
              </div>
              {getStatusIcon()}
            </div>
            <div className="mt-4">
              {!isConnected ? (
                <button
                  onClick={connectWebSocket}
                  disabled={connectionStatus === 'connecting'}
                  className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
                </button>
              ) : (
                <button
                  onClick={disconnectWebSocket}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Messages Received</h3>
                <p className="text-2xl font-bold text-[#374151]">{messageCount}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Last: {lastMessageTime || 'Never'}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Active Connections</h3>
                <p className="text-2xl font-bold text-[#374151]">{activeConnections}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">System-wide connections</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Subscriptions</h3>
                <p className="text-2xl font-bold text-[#374151]">{subscriptions.length}</p>
              </div>
              <Wifi className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Active topic subscriptions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topic Subscriptions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Topic Subscriptions</h2>
            
            <div className="space-y-3">
              {availableTopics.map((topic) => {
                const isSubscribed = subscriptions.includes(topic);
                return (
                  <div key={topic} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-[#374151]">{topic}</p>
                      <p className="text-sm text-gray-500">
                        {isSubscribed ? 'Subscribed' : 'Not subscribed'}
                      </p>
                    </div>
                    <button
                      onClick={() => isSubscribed ? unsubscribeFromTopic(topic) : subscribeToTopic(topic)}
                      disabled={!isConnected}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        isSubscribed
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      } disabled:bg-gray-100 disabled:text-gray-400`}
                    >
                      {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connection Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Connection Details</h2>
            
            {connectionInfo ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-[#374151]">Connection ID</p>
                  <p className="text-sm text-gray-600 font-mono">{connectionInfo.connection_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#374151]">Connected At</p>
                  <p className="text-sm text-gray-600">{new Date(connectionInfo.connected_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#374151]">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    connectionInfo.status === 'connected' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {connectionInfo.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <WifiOff className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No active connection</p>
                <p className="text-sm text-gray-400">Connect to view details</p>
              </div>
            )}
          </div>

          {/* Message Stream Controls */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#1e3a8a]">Message Stream</h2>
              <button
                onClick={clearMessages}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                Clear Messages
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#374151]">Total Messages:</span>
                <span className="font-medium">{messageCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#374151]">Buffer Size:</span>
                <span className="font-medium">{messages.length}/50</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#374151]">Connection State:</span>
                <span className={`font-medium ${getStatusColor()}`}>
                  {connectionStatus}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-[#374151] font-medium mb-1">WebSocket URL</p>
              <p className="text-xs text-gray-600 font-mono break-all">
                {process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/api/v1/ws/stream'}
              </p>
            </div>
          </div>
        </div>

        {/* Message Log */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#1e3a8a]">Live Message Log</h2>
            <p className="text-sm text-gray-600 mt-1">Real-time messages from WebSocket connection</p>
          </div>
          
          <div className="h-96 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No messages received yet</p>
                <p className="text-sm text-gray-400">Connect and subscribe to topics to see live data</p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((message, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#1e3a8a]">{message.type}</span>
                      <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <pre className="text-xs text-[#374151] font-mono bg-white p-2 rounded overflow-x-auto">
                      {JSON.stringify(message.data, null, 2)}
                    </pre>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Technical Information */}
        <div className="mt-8 bg-slate-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Technical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-[#374151] mb-2">WebSocket Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time bidirectional communication</li>
                <li>• Topic-based subscription system</li>
                <li>• Automatic reconnection handling</li>
                <li>• Connection state management</li>
                <li>• Message buffering and rate limiting</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[#374151] mb-2">Available Data Streams</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Risk assessment updates</li>
                <li>• Economic indicator changes</li>
                <li>• Market volatility alerts</li>
                <li>• System health notifications</li>
                <li>• Cache performance metrics</li>
                <li>• risk model performance data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
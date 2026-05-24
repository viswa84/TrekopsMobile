import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { io } from 'socket.io-client';
import { config } from '../lib/config';
import { useAuth } from './AuthContext';

const SocketContext = createContext({ socket: null, connected: false });

export function SocketProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    const socket = io(config.socketUrl, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', () => setConnected(false));

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && !socket.connected) socket.connect();
    });

    return () => {
      sub.remove();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, ref: socketRef }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);

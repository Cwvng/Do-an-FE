import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { AppState, useSelector } from '../redux/store';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: any[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = (): SocketContextType => {
  return useContext(SocketContext) as SocketContextType;
};

interface SocketContextProviderProps {
  children: ReactNode;
}

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const authUser = useSelector((app: AppState) => app.user.userInfo);

  useEffect(() => {
    if (authUser) {
      const newSocket = io(import.meta.env.VITE_API_ENDPOINT, {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(newSocket);

      newSocket.on('getOnlineUsers', (users: any[]) => {
        setOnlineUsers(users);
      });

      return () => {
        if (newSocket) newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>
  );
};

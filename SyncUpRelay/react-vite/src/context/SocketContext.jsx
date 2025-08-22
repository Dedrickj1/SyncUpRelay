
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';


const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://syncuprelay.onrender.com' 
  : 'http://127.0.0.1:8000';


const SocketContext = createContext();


export const useSocket = () => useContext(SocketContext);


export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    
    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

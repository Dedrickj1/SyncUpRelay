import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// 1. Create the context
const SocketContext = createContext();

// 2. Create a custom hook to use the context, which makes it easier to access
export const useSocket = () => useContext(SocketContext);

// 3. Create the provider component that will wrap your entire app
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish the connection when the component mounts.
    // Make sure the URL matches your Flask server's address and port.
    const newSocket = io("http://127.0.0.1:8000"); // Your Flask server URL
    setSocket(newSocket);

    // It's good practice to clean up the connection when the component unmounts.
    return () => newSocket.disconnect();
  }, []); // The empty dependency array ensures this runs only once.

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

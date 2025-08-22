import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';


const SocketContext = createContext();


export const useSocket = () => useContext(SocketContext);


export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish the connection when the component mounts. 
    // Make sure the URL matches your Flask server's address and port.
    const newSocket = io("https://syncuprelay.onrender.com/"); // Your Flask server URL
    setSocket(newSocket);

   
    return () => newSocket.disconnect();
  }, []); 

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

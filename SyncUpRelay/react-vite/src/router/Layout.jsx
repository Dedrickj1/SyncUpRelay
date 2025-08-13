import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import { useSocket } from "../context/SocketContext";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const socket = useSocket(); 

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // Add a new useEffect to handle the WebSocket connection
  useEffect(() => {
    // Make sure the socket is connected before using it
    if (socket) {
      // Listen for the "connect" event
      socket.on('connect', () => {
        console.log('Successfully connected to WebSocket server with ID:', socket.id);
      });

      return () => {
        socket.off('connect');
      };
    }
  }, [socket]); // This effect runs whenever the socket object changes

  return (
    <>
      <ModalProvider>
        <Navigation />
        {isLoaded && <Outlet />}
        <Modal />
      </ModalProvider>
    </>
  );
}
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal"
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation";
import ServerList from "../components/ServerList/ServerList";
import ChannelList from "../components/ChannelList/ChannelList";
import { useSocket } from "../context/SocketContext";
import "../index.css";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);
  // 1. Add state to track if the sidebar is hovered
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Successfully connected to WebSocket server with ID:', socket.id);
      });
      return () => socket.off('connect');
    }
  }, [socket]);

  return (
    <>
      <ModalProvider>
        <Navigation />
        {isLoaded && (
          <div className="app-body">
            {/* 2. Create a wrapper for the sidebar area */}
            <div 
              className="sidebar-container"
              onMouseEnter={() => setIsSidebarHovered(true)}
              onMouseLeave={() => setIsSidebarHovered(false)}
            >
              <ServerList onSelectServer={setSelectedServer} />
              {/* 3. Pass the hover state to the ChannelList */}
              <ChannelList server={selectedServer} isVisible={isSidebarHovered} />
            </div>
            <div className="main-content">
              <Outlet />
            </div>
          </div>
        )}
        <Modal />
      </ModalProvider>
    </>
  );
}
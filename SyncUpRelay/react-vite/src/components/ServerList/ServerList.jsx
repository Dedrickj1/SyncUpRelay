import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { useSocket } from '../../context/SocketContext'; // 1. Import useSocket
import ServerFormModal from '../ServerFormModal';
import DeleteServerModal from '../DeleteServerModal';
import './ServerList.css';

function ServerList({ onSelectServer }) {
  const [servers, setServers] = useState([]);
  const [error, setError] = useState(null);
  const { setModalContent } = useModal();
  const user = useSelector(state => state.session.user);
  const socket = useSocket(); // 2. Get the socket instance

  // 3. Wrap fetchServers in useCallback to prevent re-creation on every render
  const fetchServers = useCallback(async () => {
    try {
      const response = await fetch('/api/servers');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setServers(data);
      if (data.length > 0) {
        onSelectServer(data[0]);
      }
    } catch (error) {
      setError(error.message);
    }
  }, [onSelectServer]);

  // This effect fetches the initial list of servers
  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  // 4. This new effect listens for WebSocket events
  useEffect(() => {
    if (!socket) return;

    // When we hear a 'servers_updated' event, re-fetch the server list
    socket.on('servers_updated', fetchServers);

    // Clean up the listener when the component unmounts
    return () => {
      socket.off('servers_updated', fetchServers);
    };
  }, [socket, fetchServers]);

  const handleDeleteServer = (server) => {
    setModalContent(<DeleteServerModal server={server} />);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <nav className="server-list-container">
      <ul className="server-list">
        {servers.map(server => (
          <li key={server.id} className="server-icon-wrapper">
            <div
              className="server-icon"
              title={server.name}
              onClick={() => onSelectServer(server)}
            >
              {server.name.charAt(0).toUpperCase()}
            </div>
            {user && user.id === server.ownerId && (
              <div className="server-actions">
                <ServerFormModal formType="Update" server={server} />
                <button onClick={() => handleDeleteServer(server)} className="action-button delete-button">
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
        {user && (
          <ServerFormModal formType="Create" />
        )}
      </ul>
    </nav>
  );
}

export default ServerList;
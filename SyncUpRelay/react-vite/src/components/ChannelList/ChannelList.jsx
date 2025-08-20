import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { useSocket } from '../../context/SocketContext';
import ChannelFormModal from '../ChannelFormModal';
import DeleteChannelModal from '../DeleteChannelModal'; 
import './ChannelList.css';

function ChannelList({ server, onSelectChannel, isVisible }) {
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);
  const { setModalContent } = useModal();
  const user = useSelector(state => state.session.user);
  const socket = useSocket();

  
  const fetchChannels = useCallback(async () => {
    if (!server) return;
    try {
      const response = await fetch(`/api/servers/${server.id}/channels`);
      if (!response.ok) throw new Error('Failed to fetch channels');
      const data = await response.json();
      setChannels(data);
    } catch (err) {
      setError(err.message);
    }
  }, [server]);

  
  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  
  useEffect(() => {
    if (!socket || !server) return;

  
    const handleChannelUpdate = (data) => {
      
      if (data.server_id === server.id) {
       
        fetchChannels();
      }
    };

    socket.on('channels_updated', handleChannelUpdate);

    
    return () => {
      socket.off('channels_updated', handleChannelUpdate);
    };
  }, [socket, server, fetchChannels]);

  const handleDeleteChannel = (channel) => {
    setModalContent(<DeleteChannelModal channel={channel} />);
  };

  if (error) return <div className="channel-list-container">Error: {error}</div>;

  const containerClassName = `channel-list-container ${isVisible ? 'visible' : ''}`;

  return (
    <div className={containerClassName}>
      <header className="channel-list-header">
        <h2 className="server-name">{server ? server.name : 'Select a Server'}</h2>
      </header>
      <div className="channels">
        <div className="channels-header">
          <h3 className="channels-title">Text Channels</h3>
          {user && user.id === server?.ownerId && (
            <ChannelFormModal formType="Create" serverId={server.id} />
          )}
        </div>
        <ul className="channel-list">
          {channels.map(channel => (
            <li
              key={channel.id}
              className="channel-item"
              onClick={() => onSelectChannel(channel)}
            >
              <div className="channel-name-wrapper">
                <span className="channel-hashtag">#</span>
                <span className="channel-name">{channel.name}</span>
              </div>
              {user && user.id === channel.ownerId && (
                <div className="channel-actions">
                  <ChannelFormModal formType="Update" channel={channel} />
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteChannel(channel); }} className="action-button delete-button">
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChannelList;
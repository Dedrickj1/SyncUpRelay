import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { useSocket } from '../../context/SocketContext';
import ChannelFormModal from '../ChannelFormModal/ChannelForm';
import DeleteChannelModal from '../DeleteChannelModal/DeleteChannelModal'; 
import './ChannelList.css';

function ChannelList({ server, selectedChannel, onSelectChannel, isVisible }) {
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);
  const { setModalContent } = useModal();
  const user = useSelector(state => state.session.user);
  const socket = useSocket();

  const fetchChannels = useCallback(async (isUpdate = false) => {
    if (!server) return;
    try {
      const response = await fetch(`/api/servers/${server.id}/channels`);
      if (!response.ok) throw new Error('Failed to fetch channels');
      const data = await response.json();
      setChannels(data);

      if (isUpdate) {
        
        const updatedSelection = data.find(c => c.id === selectedChannel?.id);
        if (updatedSelection) {
          
          onSelectChannel(updatedSelection);
        } else {
          
          onSelectChannel(data.length > 0 ? data[0] : null);
        }
      } else if (data.length > 0) {
        
        onSelectChannel(data[0]);
      } else {
        onSelectChannel(null);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [server, selectedChannel, onSelectChannel]);

  useEffect(() => {
    
    if (server) {
        fetchChannels();
    }
  }, [server]); 

  useEffect(() => {
    if (!socket || !server) return;

    const handleChannelUpdate = (data) => {
      if (data.server_id === server.id) {
       
        fetchChannels(true);
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
              className={`channel-item ${selectedChannel?.id === channel.id ? 'selected' : ''}`}
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
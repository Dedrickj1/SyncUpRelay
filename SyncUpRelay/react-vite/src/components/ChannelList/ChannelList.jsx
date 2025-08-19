import React, { useState, useEffect } from 'react';
import './ChannelList.css';

// 1. Accept the new isVisible prop
function ChannelList({ server, isVisible }) {
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!server) {
      setChannels([]);
      return;
    }
    const fetchChannels = async () => {
      try {
        const response = await fetch(`/api/servers/${server.id}/channels`);
        if (!response.ok) throw new Error('Failed to fetch channels');
        const data = await response.json();
        setChannels(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchChannels();
  }, [server]);

  if (error) return <div className="channel-list-container">Error: {error}</div>;

  // 2. Add the 'visible' class based on the isVisible prop
  const containerClassName = `channel-list-container ${isVisible ? 'visible' : ''}`;

  return (
    <div className={containerClassName}>
      <header className="channel-list-header">
        <h2 className="server-name">{server ? server.name : 'Select a Server'}</h2>
      </header>
      <div className="channels">
        <h3 className="channels-title">Text Channels</h3>
        <ul className="channel-list">
          {channels.map(channel => (
            <li key={channel.id} className="channel-item">
              <span className="channel-hashtag">#</span>
              <span className="channel-name">{channel.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChannelList;
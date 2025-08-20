import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../../context/SocketContext'; 
import './MessagePane.css';

function MessagePane({ channel }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const user = useSelector(state => state.session.user);
  const socket = useSocket(); 

  
  useEffect(() => {
    if (!channel) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/channels/${channel.id}/messages`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMessages();
  }, [channel]);

  
  useEffect(() => {
    
    if (!socket || !channel) return;

    
    socket.emit('join_channel', channel.id);

   
    const handleNewMessage = (message) => {
      
      if (message.channelId === channel.id) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    };

   
    socket.on('new_message', handleNewMessage);

    
    return () => {
      socket.emit('leave_channel', channel.id);
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, channel]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const response = await fetch(`/api/channels/${channel.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newMessage }),
    });

    if (response.ok) {
      
      setNewMessage("");
    } else {
      const errorData = await response.json();
      console.error("Failed to send message:", errorData);
    }
  };

  if (!channel) {
    return (
      <div className="message-pane-container">
        <div className="placeholder">
          <h2>Select a channel to start chatting</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="message-pane-container">Error: {error}</div>;
  }

  return (
    <div className="message-pane-container">
      <header className="message-pane-header">
        <span className="header-hashtag">#</span>
        <h2 className="channel-name-header">{channel.name}</h2>
      </header>
      <div className="message-list">
        {messages.map(message => (
          <div key={message.id} className="message">
            <div className="message-avatar"></div>
            <div className="message-content">
              <span className="message-username">User {message.userId}</span>
              <p className="message-text">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {user && (
        <form className="message-input-container" onSubmit={handleSubmit}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message #${channel.name}`}
            className="message-input"
          />
        </form>
      )}
    </div>
  );
}

export default MessagePane;
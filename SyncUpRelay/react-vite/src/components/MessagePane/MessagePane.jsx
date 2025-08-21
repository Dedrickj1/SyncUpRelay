import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../../context/SocketContext';
import { useModal } from '../../context/Modal';
import EditMessageModal from '../EditMessageModal/EditMessageModal';
import DeleteMessageModal from '../DeleteMessageModal/DeleteMessageModal';
import './MessagePane.css';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '💯', '✅', '🎉'];

function MessagePane({ channel }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activePickerId, setActivePickerId] = useState(null);
  const user = useSelector(state => state.session.user);
  const socket = useSocket();
  const { setModalContent } = useModal();
  const pickerRef = useRef();

  useEffect(() => {
    if (!activePickerId) return;
    const handleClickAway = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setActivePickerId(null);
      }
    };
    document.addEventListener('mousedown', handleClickAway);
    return () => document.removeEventListener('mousedown', handleClickAway);
  }, [activePickerId]);

  useEffect(() => {
    if (!channel) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      const response = await fetch(`/api/channels/${channel.id}/messages`);
      const data = await response.json();
      setMessages(data);
    };
    fetchMessages();
  }, [channel]);

  useEffect(() => {
    if (!socket || !channel) return;
    socket.emit('join_channel', channel.id);

    const handleNewMessage = (message) => {
      if (message.channelId === channel.id) setMessages(prev => [...prev, message]);
    };
    const handleUpdateMessage = (updatedMessage) => {
      if (updatedMessage.channelId === channel.id) setMessages(prev => prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg));
    };
    const handleDeleteMessage = (data) => {
      if (data.channel_id === channel.id) setMessages(prev => prev.filter(msg => msg.id !== data.message_id));
    };
    const handleReactionUpdate = (updatedMessage) => {
        if (updatedMessage.channelId === channel.id) {
            setMessages(prev => prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg));
        }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_updated', handleUpdateMessage);
    socket.on('message_deleted', handleDeleteMessage);
    socket.on('reaction_updated', handleReactionUpdate);

    return () => {
      socket.emit('leave_channel', channel.id);
      socket.off('new_message', handleNewMessage);
      socket.off('message_updated', handleUpdateMessage);
      socket.off('message_deleted', handleDeleteMessage);
      socket.off('reaction_updated', handleReactionUpdate);
    };
  }, [socket, channel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await fetch(`/api/channels/${channel.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newMessage }),
    });
    setNewMessage("");
  };

  const handleReactionClick = async (message, emoji) => {
    if (!user) return;
    const userReaction = message.reactions.find(r => r.userId === user.id && r.emoji === emoji);
    if (userReaction) {
      await fetch(`/api/reactions/${userReaction.id}`, { method: 'DELETE' });
    } else {
      await fetch(`/api/messages/${message.id}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji })
      });
    }
    setActivePickerId(null);
  };
  
  const openEditModal = (message) => setModalContent(<EditMessageModal message={message} />);
  const openDeleteModal = (message) => setModalContent(<DeleteMessageModal message={message} />);

  const groupReactions = (reactions) => {
    return reactions.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {});
  };

  // Helper function to format the timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="message-pane-container">
      <header className="message-pane-header">
        <span className="header-hashtag">#</span>
        <h2 className="channel-name-header">{channel ? channel.name : ''}</h2>
      </header>
      <div className="message-list">
        {messages.map(message => {
            const groupedReactions = groupReactions(message.reactions);
            return (
                <div key={message.id} className="message">
                    <div className="message-avatar"></div>
                    <div className="message-content">
                        <div className="message-header">
                            <span className="message-username">{message.userName}</span>
                            <span className="message-timestamp">{formatTime(message.createdAt)}</span>
                        </div>
                        <p className="message-text">{message.text}</p>
                        <div className="reactions-list">
                            {Object.entries(groupedReactions).map(([emoji, count]) => {
                                const userHasReacted = user && message.reactions.some(r => r.userId === user.id && r.emoji === emoji);
                                return (
                                    <div 
                                        key={emoji} 
                                        className={`reaction-pill ${userHasReacted ? 'user-reacted' : ''}`}
                                        onClick={() => handleReactionClick(message, emoji)}
                                    >
                                        <span>{emoji}</span>
                                        <span>{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {user && (
                        <div className="message-actions">
                            {user.id === message.userId && (
                                <>
                                    <button onClick={() => openEditModal(message)} className="action-button">Edit</button>
                                    <button onClick={() => openDeleteModal(message)} className="action-button">Delete</button>
                                </>
                            )}
                            <div className="reaction-picker" ref={activePickerId === message.id ? pickerRef : null}>
                                <button onClick={() => setActivePickerId(activePickerId === message.id ? null : message.id)} className="action-button">😊</button>
                                {activePickerId === message.id && (
                                    <div className="emoji-list">
                                        {EMOJIS.map(emoji => (
                                            <span key={emoji} onClick={() => handleReactionClick(message, emoji)}>{emoji}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            );
        })}
      </div>
      {user && (
        <form className="message-input-container" onSubmit={handleSubmit}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message #${channel ? channel.name : ''}`}
            className="message-input"
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      )}
    </div>
  );
}

export default MessagePane;
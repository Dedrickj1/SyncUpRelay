import React from 'react';
import { useModal } from '../../context/Modal';
import './DeleteChannelModal.css';

function DeleteChannelModal({ channel }) {
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/channels/${channel.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
    
        console.log(`Channel ${channel.name} deleted successfully.`);
        closeModal();
      } else {
        const data = await res.json();
        console.error("Failed to delete channel:", data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="delete-modal-container">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete the channel "{channel.name}"? This action cannot be undone.</p>
      <div className="delete-modal-buttons">
        <button onClick={handleDelete} className="delete-button">Yes (Delete Channel)</button>
        <button onClick={closeModal} className="cancel-button">No (Keep Channel)</button>
      </div>
    </div>
  );
}

export default DeleteChannelModal;
import React from 'react';
import { useModal } from '../../context/Modal';
import './DeleteServerModal.css';

function DeleteServerModal({ server }) {
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/servers/${server.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // We will add WebSocket logic here later to update the list in real-time
        console.log(`Server ${server.name} deleted successfully.`);
        closeModal();
      } else {
        const data = await res.json();
        console.error("Failed to delete server:", data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="delete-modal-container">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove the server "{server.name}"? This action cannot be undone.</p>
      <div className="delete-modal-buttons">
        <button onClick={handleDelete} className="delete-button">Yes (Delete Server)</button>
        <button onClick={closeModal} className="cancel-button">No (Keep Server)</button>
      </div>
    </div>
  );
}

export default DeleteServerModal;
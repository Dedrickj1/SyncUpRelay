import React from 'react';
import { useModal } from '../../context/Modal';
import './DeleteMessageModal.css';

function DeleteMessageModal({ message }) {
  const { closeModal } = useModal();

  const handleDelete = async () => {
    await fetch(`/api/messages/${message.id}`, {
      method: 'DELETE'
    });
   
    closeModal();
  };

  return (
    <div className="delete-modal-container">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this message?</p>
      <div className="delete-modal-buttons">
        <button onClick={handleDelete} className="delete-button">Yes (Delete Message)</button>
        <button onClick={closeModal} className="cancel-button">No (Keep Message)</button>
      </div>
    </div>
  );
}

export default DeleteMessageModal;

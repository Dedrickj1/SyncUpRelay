import React, { useState } from 'react';
import { useModal } from '../../context/Modal';
import './EditMessageModal.css';

function EditMessageModal({ message }) {
  const { closeModal } = useModal();
  const [text, setText] = useState(message.text);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const res = await fetch(`/api/messages/${message.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (res.ok) {
      closeModal();
    } else {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  return (
    <div className="edit-message-form-container">
      <h1>Edit Message</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        {errors.text && <p className="error">{errors.text}</p>}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditMessageModal;
import React, { useState } from 'react';
import { useModal } from '../../context/Modal';
import './ServerForm.css';

function ServerForm({ formType, server }) {
  const { closeModal } = useModal();
  const [name, setName] = useState(server ? server.name : '');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const serverData = { name };
    let url = '/api/servers';
    let method = 'POST';

    if (formType === 'Update') {
      url = `/api/servers/${server.id}`;
      method = 'PUT';
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serverData)
      });

      if (res.ok) {
        // We will add WebSocket logic here later to update the list in real-time
        closeModal();
      } else {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setErrors({ general: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="server-form-container">
      <h1>{formType === 'Create' ? 'Create a Server' : 'Update Your Server'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Server Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        {errors.name && <p className="error">{errors.name}</p>}
        <button type="submit">{formType === 'Create' ? 'Create Server' : 'Update Server'}</button>
      </form>
    </div>
  );
}

export default ServerForm;
import React, { useState } from 'react';
import { useModal } from '../../context/Modal';
import './ChannelForm.css';

function ChannelForm({ formType, channel, serverId }) {
  const { closeModal } = useModal();
  const [name, setName] = useState(channel ? channel.name : '');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const channelData = { name };
    let url = `/api/servers/${serverId}/channels`;
    let method = 'POST';

    if (formType === 'Update') {
      url = `/api/channels/${channel.id}`;
      method = 'PUT';
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channelData)
      });

      if (res.ok) {
        // We'll add WebSocket logic here later for real-time updates
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
    <div className="channel-form-container">
      <h1>{formType === 'Create' ? 'Create Channel' : 'Update Channel'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Channel Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="new-channel"
          />
        </label>
        {errors.name && <p className="error">{errors.name}</p>}
        <button type="submit">{formType === 'Create' ? 'Create Channel' : 'Update Channel'}</button>
      </form>
    </div>
  );
}

export default ChannelForm;
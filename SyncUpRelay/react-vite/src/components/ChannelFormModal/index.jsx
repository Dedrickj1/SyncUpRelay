import React from 'react';
import { useModal } from '../../context/Modal';
import ChannelForm from '../ChannelForm';

function ChannelFormModal({ formType, channel, serverId }) {
  const { setModalContent } = useModal();

  const openChannelForm = () => {
    setModalContent(<ChannelForm formType={formType} channel={channel} serverId={serverId} />);
  };

  if (formType === "Update") {
    return (
      <button onClick={openChannelForm} className="action-button edit-button">
        Edit
      </button>
    );
  } else {
    return (
      <button onClick={openChannelForm} className="action-button create-channel-button" title="Create Channel">
        +
      </button>
    );
  }
}

export default ChannelFormModal;
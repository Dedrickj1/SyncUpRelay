import React from 'react';
import { useModal } from '../../context/Modal';
import ServerForm from '../ServerForm/ServerForm';

function ServerFormModal({ formType, server }) {
  const { setModalContent } = useModal();

  const openServerForm = () => {
    setModalContent(<ServerForm formType={formType} server={server} />);
  };

  if (formType === "Update") {
    return (
      <button onClick={openServerForm} className="action-button edit-button">
        Edit
      </button>
    );
  } else {
    return (
       <li className="server-icon add-server-button" title="Add Server" onClick={openServerForm}>
        +
      </li>
    );
  }
}

export default ServerFormModal;

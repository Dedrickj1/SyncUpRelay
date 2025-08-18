import React, { useState, useEffect } from 'react';
import './ServerList.css';

// The component accepts the onSelectServer function as a prop from Layout.jsx
function ServerList({ onSelectServer }) {
  const [servers, setServers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        // Fetch the list of servers from the public API route
        const response = await fetch('/api/servers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setServers(data);
        // Automatically select the first server when the list loads
        if (data.length > 0) {
          onSelectServer(data[0]);
        }
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch servers:", error);
      }
    };

    fetchServers();
  }, [onSelectServer]); // The dependency array ensures this runs when the function prop is available.

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <nav className="server-list-container">
      <ul className="server-list">
        {servers.map(server => (
          // When a server icon is clicked, it calls the onSelectServer function
          // passed down from Layout.jsx, updating the selectedServer state.
          <li 
            key={server.id} 
            className="server-icon" 
            title={server.name} 
            onClick={() => onSelectServer(server)}
          >
            {server.name.charAt(0).toUpperCase()}
          </li>
        ))}
        <li className="server-icon add-server-button" title="Add Server">
          +
        </li>
      </ul>
    </nav>
  );
}

export default ServerList;

import React, { useState, useEffect } from 'react';

function App() {
  const [folders, setFolders] = useState(() => {
    const storedFolders = localStorage.getItem('folders');
    return storedFolders ? JSON.parse(storedFolders) : [];
  }); // Load folders directly into initial state
  const [currentPath, setCurrentPath] = useState([]); // Track the path to the current folder
  const [folderName, setFolderName] = useState(''); // New folder name
  const [showPopup, setShowPopup] = useState(false); // Show popup for folder creation

  // Save folders to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  // Helper to get the current folder based on the path
  const getCurrentFolder = () => {
    let folder = { children: folders }; // Start from the root
    for (const part of currentPath) {
      folder = folder.children.find((child) => child.name === part);
    }
    return folder;
  };

  // Function to add a folder at the current level
  const addFolder = () => {
    if (folderName.trim() !== '') {
      const newFolder = { name: folderName.trim(), children: [] };
      if (currentPath.length === 0) {
        setFolders([...folders, newFolder]); // Add to root level
      } else {
        const currentFolder = getCurrentFolder();
        currentFolder.children.push(newFolder); // Add to current folder
        setFolders([...folders]); // Trigger a state update
      }
      setFolderName('');
      setShowPopup(false); // Close the popup
    }
  };

  // Function to navigate into a folder
  const openFolder = (folderName) => {
    setCurrentPath([...currentPath, folderName]); // Add folder to the path
  };

  // Function to navigate back one level
  const goBack = () => {
    setCurrentPath(currentPath.slice(0, -1)); // Remove the last folder in the path
  };

  // Function to return to the main menu
  const goToMenu = () => {
    setCurrentPath([]); // Clear the path
  };

  // Render folders for the current view
  const renderFolders = (folderList) => {
    return (
      <ul>
        {folderList.map((folder, index) => (
          <li key={index}>
            <span
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
                color: 'blue',
              }}
              onClick={() => openFolder(folder.name)} // Open the folder
            >
              {folder.name}
            </span>
            <button
              style={{
                marginLeft: '10px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '5px',
                cursor: 'pointer',
              }}
              onClick={() =>
                setFolders(folderList.filter((f) => f !== folder)) // Delete folder
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    );
  };

  const currentFolder = getCurrentFolder(); // Get the current folder based on the path

  return (
    <div style={{ padding: '20px' }}>
      <h1>RC Tracker</h1>

      {/* Popup for Creating a Folder */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <h2>Create Folder</h2>
          <input
            type="text"
            placeholder="Enter folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
          />
          <div style={{ marginTop: '10px' }}>
            <button
              onClick={addFolder}
              style={{
                marginRight: '10px',
                padding: '8px 16px',
                backgroundColor: 'green',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Create
            </button>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'gray',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Current Folder View */}
      {currentPath.length > 0 ? (
        <div>
          <h2>{currentPath[currentPath.length - 1]}</h2>
          <button onClick={goBack}>Back</button>
          {currentPath.length > 1 && (
            <button onClick={goToMenu} style={{ marginLeft: '10px' }}>
              Back to Menu
            </button>
          )}
          <button
            onClick={() => setShowPopup(true)}
            style={{ marginLeft: '10px' }}
          >
            Create Subfolder
          </button>
          {renderFolders(currentFolder.children)}
        </div>
      ) : (
        <div>
          <button onClick={() => setShowPopup(true)}>Create Folder</button>
          {renderFolders(folders)}
        </div>
      )}
    </div>
  );
}

export default App;

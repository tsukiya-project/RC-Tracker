import React, { useState, useEffect } from 'react';

function App() {
  const [folders, setFolders] = useState(() => {
    const storedFolders = localStorage.getItem('folders');
    return storedFolders ? JSON.parse(storedFolders) : [];
  }); // Load folders directly into initial state
  const [tables, setTables] = useState(() => {
    const storedTables = localStorage.getItem('tables');
    return storedTables ? JSON.parse(storedTables) : [];
  }); // Separate state for tables in the main menu
  const [currentPath, setCurrentPath] = useState([]); // Track the path to the current folder
  const [folderName, setFolderName] = useState(''); // New folder name
  const [showPopup, setShowPopup] = useState(false); // Show popup for folder creation
  const [showTablePopup, setShowTablePopup] = useState(false); // Show popup for table creation
  const [tableName, setTableName] = useState(''); // New table name

  // Save folders and tables to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
    localStorage.setItem('tables', JSON.stringify(tables));
  }, [folders, tables]);

  // Helper to get the current folder based on the path
  const getCurrentFolder = () => {
    let folder = { children: folders, tables: [] }; // Initialize tables
    for (const part of currentPath) {
      folder = folder.children.find((child) => child.name === part);
    }
    if (!folder.tables) {
      folder.tables = []; // Ensure tables is always an array
    }
    return folder;
  };

  // Function to add a folder at the current level
  const addFolder = () => {
    if (folderName.trim() !== '') {
      const newFolder = { name: folderName.trim(), children: [], tables: [] }; // Initialize tables
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

  // Function to delete a folder
  const deleteFolder = (folderNameToDelete) => {
    const deleteRecursive = (folderList) => {
      return folderList.filter((folder) => folder.name !== folderNameToDelete);
    };

    if (currentPath.length === 0) {
      setFolders(deleteRecursive(folders)); // Delete from root level
    } else {
      const currentFolder = getCurrentFolder();
      currentFolder.children = deleteRecursive(currentFolder.children); // Delete from subfolder
      setFolders([...folders]); // Trigger a state update
    }
  };

  // Function to add a table
  const addTable = () => {
    if (tableName.trim() !== '') {
      const newTable = { name: tableName.trim(), rows: [], columns: ['Column 1', 'Column 2'] };
      if (currentPath.length === 0) {
        // Add table to the main menu
        setTables([...tables, newTable]); // Directly update tables in the root
      } else {
        // Add table to the current folder
        const currentFolder = getCurrentFolder();
        if (currentFolder && currentFolder.tables) {
          currentFolder.tables.push(newTable); // Add to tables array
          setFolders([...folders]); // Trigger a state update
        }
      }
      setTableName('');
      setShowTablePopup(false); // Close the popup
    }
  };

  // Function to delete a table
  const deleteTable = (tableNameToDelete) => {
    if (currentPath.length === 0) {
      // Delete table from main menu
      setTables(tables.filter((table) => table.name !== tableNameToDelete));
    } else {
      // Delete table from a folder
      const currentFolder = getCurrentFolder();
      currentFolder.tables = currentFolder.tables.filter((table) => table.name !== tableNameToDelete);
      setFolders([...folders]); // Trigger a state update
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
    if (!folderList || folderList.length === 0) {
      return currentPath.length === 0 ? (
        <p>No folders yet. Add one above!</p> // Message for main menu
      ) : (
        <p>No folders found in this folder.</p> // Message for subfolders
      );
    }

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
              onClick={() => deleteFolder(folder.name)} // Delete folder
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    );
  };

  // Render tables for the current folder
  const renderTables = (tableList) => {
    if (!tableList || tableList.length === 0) {
      return <p>No tables found in this folder.</p>;
    }

    return (
      <div>
        <h3>Tables</h3>
        <ul>
          {tableList.map((table, index) => (
            <li key={index}>
              <span>{table.name}</span>
              <button
                style={{
                  marginLeft: '10px',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  padding: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => deleteTable(table.name)} // Delete table
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

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

      {/* Popup for Creating a Table */}
      {showTablePopup && (
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
          <h2>Create Table</h2>
          <input
            type="text"
            placeholder="Enter table name"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
          />
          <div style={{ marginTop: '10px' }}>
            <button
              onClick={addTable}
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
              onClick={() => setShowTablePopup(false)}
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
          {renderFolders(getCurrentFolder().children)}
          {renderTables(getCurrentFolder().tables)}
          <button onClick={() => setShowPopup(true)} style={{ marginTop: '10px' }}>
            Create Folder
          </button>
          <button onClick={() => setShowTablePopup(true)} style={{ marginLeft: '10px' }}>
            Create Table
          </button>
        </div>
      ) : (
        <div>
          {renderFolders(folders)}
          {renderTables(tables)}
          <button onClick={() => setShowPopup(true)} style={{ marginTop: '10px' }}>
            Create Folder
          </button>
          <button onClick={() => setShowTablePopup(true)} style={{ marginLeft: '10px' }}>
            Create Table
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

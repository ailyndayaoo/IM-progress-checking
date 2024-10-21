import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API calls
import '../css/modal.css';

const Modal = ({ isOpen, onClose, onAddBranch, onConfirmDelete, isDeleteMode, branchName }) => {
  const [newBranchName, setNewBranchName] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (isDeleteMode) {
        setNewBranchName(branchName || ''); // Set to the branch name if in delete mode
      } else {
        setNewBranchName(''); // Clear input for add mode
      }
    }
  }, [isOpen, isDeleteMode, branchName]);

  const handleAddBranch = async () => {
    if (newBranchName.trim()) {
      try {
        // API call to add the branch, including the status
        const response = await axios.post('https://vynceianoani.helioho.st/addbranch.php', {
          name: newBranchName,
          status: 'active' // Setting the status to 'active' by default
        });
        
        // Call the onAddBranch callback to update the state in the parent component
        onAddBranch(response.data); // Pass the newly added branch to the parent
        setNewBranchName(''); // Clear the input field
        onClose(); // Close the modal
      } catch (error) {
        console.error('Error adding branch:', error);
        alert('Error adding branch, please try again.'); // Handle API error
      }
    } else {
      alert('Branch name cannot be empty!'); // Alert if the input is empty
    }
  };

  const handleConfirmDelete = () => {
    onConfirmDelete();
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {isDeleteMode ? (
          <>
            <h2>Are you sure you want to delete this branch?</h2>
            <p>{branchName}</p>
            <div className="modal-buttons">
              <button onClick={handleConfirmDelete}>Yes</button>
              <button onClick={onClose}>No</button>
            </div>
          </>
        ) : (
          <>
            <h2>Add Branch</h2>
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="Enter branch name"
            />
            <div className="modal-buttons">
              <button onClick={handleAddBranch}>Add Branch</button>
              <button onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;

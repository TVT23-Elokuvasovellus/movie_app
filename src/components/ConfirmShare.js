import React from 'react';
import './ConfirmShare.css';

const ConfirmShare = ({ show, handleClose, handleConfirm, movieTitle, groupName }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Share Movie</h2>
        <p>Do you want to share <strong>{movieTitle}</strong> on <strong>{groupName}</strong>?</p>
        <div className="modal-actions">
          <button onClick={handleConfirm}>Yes</button>
          <button onClick={handleClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmShare;

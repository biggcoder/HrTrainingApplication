import React, { useState } from 'react';
import axiosInstance from '../../api/axiosConfig';

function AssignMentorModal({ intern, mentors, onClose, onSuccess }) {
  const [selectedMentorId, setSelectedMentorId] = useState(intern.mentor?._id || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMentorId) {
      setError('Please select a mentor.');
      return;
    }
    
    setError('');
    setIsSubmitting(true);

    try {
      await axiosInstance.put('/users/assign-mentor', {
        internId: intern._id,
        mentorId: selectedMentorId,
      });
      onSuccess(); // This will trigger a data refresh and close the modal
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign mentor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Assign Mentor to {intern.name}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="mentor-select">Choose a mentor:</label>
          <select
            id="mentor-select"
            value={selectedMentorId}
            onChange={(e) => setSelectedMentorId(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          >
            <option value="" disabled>Select a mentor...</option>
            {mentors.map((mentor) => (
              <option key={mentor._id} value={mentor._id}>
                {mentor.name}
              </option>
            ))}
          </select>
          
          <div className="modal-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
            </button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default AssignMentorModal;
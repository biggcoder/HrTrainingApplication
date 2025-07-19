import React, { useState } from 'react';
import axiosInstance from '../../api/axiosConfig';

function AddProjectModal({ interns, onClose, onProjectCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedInternId, setSelectedInternId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInternId) {
        setError("Please select an intern.");
        return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await axiosInstance.post('/projects', {
        title,
        description,
        internId: selectedInternId
      });
      onProjectCreated(); // Refresh data on parent
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Assign New Project</h2>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea placeholder="Project Description" value={description} onChange={e => setDescription(e.target.value)} required />
            <select value={selectedInternId} onChange={e => setSelectedInternId(e.target.value)} required>
                <option value="" disabled>Select an Intern...</option>
                {interns && interns.map(intern => (
                    <option key={intern._id} value={intern._id}>{intern.name}</option>
                ))}
            </select>
            <div className="modal-actions">
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Assigning...' : 'Assign Project'}</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </div>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default AddProjectModal;
import React, { useState } from 'react';
import axiosInstance from '../../api/axiosConfig';

function SubmitWorkModal({ project, onClose, onSuccess }) {
  const [fileUrl, setFileUrl] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await axiosInstance.post(`/projects/${project._id}/submit`, { fileUrl, remarks });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit work.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Submit Work for: {project.title}</h2>
        <form onSubmit={handleSubmit}>
          <label>Submission Link (e.g., Google Drive, GitHub):</label>
          <input 
            type="url" 
            placeholder="https://github.com/your/repo" 
            value={fileUrl} 
            onChange={e => setFileUrl(e.target.value)} 
            required 
          />
          <label>Remarks (Optional):</label>
          <textarea 
            placeholder="Any comments for your mentor?"
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
          />
          <div className="modal-actions">
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default SubmitWorkModal;
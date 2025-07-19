import React, { useState } from 'react';
import axiosInstance from '../../api/axiosConfig';

function AddUserModal({ roleToCreate, onClose, onUserAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await axiosInstance.post('/auth/register', { 
          name, 
          email, 
          password, 
          role: roleToCreate // Use the prop to set the role
      });
      setSuccess(`${roleToCreate} ${name} created successfully!`);
      setName('');
      setEmail('');
      setPassword('');
      onUserAdded(); 
    } catch (err) {
      setError(err.response?.data?.message || `Failed to create ${roleToCreate}.`);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Add New {roleToCreate}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Temporary Password" value={password} onChange={e => setPassword(e.target.value)} required />
          
          <div className="modal-actions">
            <button type="submit">Create {roleToCreate}</button>
            <button type="button" className="secondary" onClick={onClose}>Close</button>
          </div>
        </form>
        {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}
        {success && <p style={{ color: 'var(--color-success)' }}>{success}</p>}
      </div>
    </div>
  );
}

export default AddUserModal;
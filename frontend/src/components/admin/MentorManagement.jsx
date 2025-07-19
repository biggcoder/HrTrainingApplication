import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosConfig';
import AddUserModal from './AddUserModal'; 
function MentorManagement() {
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMentors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/users?role=Mentor');
      setMentors(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch mentors.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);
  
  // We will add the modal functionality later by reusing a generic AddUserModal.
  // For now, this just displays the mentors.

  return (
    <div className="card">
      <h3>Mentor Management</h3>
      <button onClick={() => setIsAddModalOpen(true)}>+ Add New Mentor</button>
       {isAddModalOpen && <AddUserModal
        roleToCreate="Mentor"
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={fetchMentors}
      />}
      {isLoading && <p>Loading mentors...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {!isLoading && !error && (
        <table style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Assigned Interns</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map((mentor) => (
              <tr key={mentor._id}>
                <td>{mentor.name}</td>
                <td>{mentor.email}</td>
                <td>{mentor.assignedInterns?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MentorManagement;
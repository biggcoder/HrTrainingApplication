import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosConfig';
import AddInternModal from './AddInternModal';
import AssignMentorModal from './AssignMentorModal';

function InternManagement() {
  const [interns, setInterns] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [internsResponse, mentorsResponse] = await Promise.all([
        axiosInstance.get('/users?role=Intern'),
        axiosInstance.get('/users?role=Mentor')
      ]);
      setInterns(internsResponse.data);
      setMentors(mentorsResponse.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenAssignModal = (intern) => {
    setSelectedIntern(intern);
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedIntern(null);
  };
  
  const handleAssignmentSuccess = () => {
    handleCloseAssignModal();
    fetchData(); 
  };

  return (
    <div>
      <h3>Intern Management</h3>
      <button onClick={() => setIsAddModalOpen(true)}>+ Add New Intern</button>

      {isAddModalOpen && <AddInternModal 
        onClose={() => setIsAddModalOpen(false)} 
        onInternAdded={fetchData} 
      />}

      {isAssignModalOpen && selectedIntern && <AssignMentorModal
        intern={selectedIntern}
        mentors={mentors}
        onClose={handleCloseAssignModal}
        onSuccess={handleAssignmentSuccess}
      />}

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!isLoading && !error && (
        <table style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Assigned Mentor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interns.map((intern) => (
              <tr key={intern._id}>
                <td>{intern.name}</td>
                <td>{intern.email}</td>
                <td>{intern.mentor ? intern.mentor.name : 'Not Assigned'}</td>
                <td>
                  <button onClick={() => handleOpenAssignModal(intern)}>
                    {intern.mentor ? 'Change Mentor' : 'Assign Mentor'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// THIS IS THE LINE THAT NEEDS TO BE CHECKED AND ADDED
export default InternManagement;